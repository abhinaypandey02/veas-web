import { NextRequest, NextResponse } from "next/server";
import { getAstrologerAssistant, processChat } from "../../utils";
import { db } from "@/app/api/lib/db";
import { ChatRole, ChatTable } from "../../db";
import { and, eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";
import { getContext } from "naystack/auth";
import { UserTable } from "../../../User/db";
import { streamText } from "ai";

export const POST = async (req: NextRequest) => {
  const ctx = await getContext(req);
  if (!ctx?.userId) return new NextResponse("Unauthorized", { status: 401 });
  const message = await req.text();

  const chats = await db
    .select()
    .from(ChatTable)
    .where(
      and(eq(ChatTable.isSummarized, false), eq(ChatTable.userId, ctx.userId)),
    )
    .orderBy(ChatTable.createdAt, ChatTable.id);
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId));
  if (!user) return new NextResponse("User not found", { status: 404 });
  
  // Verify API key is configured
  if (!process.env.GOOGLE_API_KEY) {
    console.error("CRITICAL: GOOGLE_API_KEY not configured in environment");
    return new NextResponse(
      "AI service not configured. Please contact support.",
      { status: 500 },
    );
  }

  const astrologer = getAstrologerAssistant(user);

  console.log("[CHAT ENDPOINT] Starting stream request", {
    userId: ctx.userId,
    messageLength: message.length,
    previousChatsCount: chats.length,
    model: typeof astrologer.model,
  });

  try {
    console.log("[CHAT ENDPOINT] Creating streamText with model:", {
      modelType: typeof astrologer.model,
      hasTools: !!astrologer.tools,
    });

    const result = streamText({
      model: astrologer.model,
      system: astrologer.system,
      tools: astrologer.tools,
      messages: [
        ...chats.map((chat) => ({
          role:
            chat.role === ChatRole.assistant
              ? (ChatRole.assistant as const)
              : (ChatRole.user as const),
          content: chat.message,
        })),
        { role: ChatRole.user, content: message },
      ],
    });

    let response = "";
    const encoder = new TextEncoder();

    const transformedStream = new ReadableStream({
      async start(controller) {
        try {
          console.log("[CHAT STREAM] Starting to read text stream");
          let chunkCount = 0;
          
          for await (const chunk of result.textStream) {
            chunkCount++;
            response += chunk;
            console.log(`[CHAT STREAM] Chunk ${chunkCount}: ${chunk.length} chars`);
            controller.enqueue(encoder.encode(chunk));
          }

          console.log("[CHAT STREAM] Text stream complete", {
            totalChunks: chunkCount,
            totalLength: response.length,
          });

          // Log tool calls if any
          const toolCalls = await result.toolCalls;
          console.log("[CHAT STREAM] Tool calls:", toolCalls.length);
          for (const toolCall of toolCalls) {
            console.log("[CHAT STREAM] Tool:", toolCall.toolName, "with args:", toolCall.args);
          }

          // Log tool results if any
          const toolResults = await result.toolResults;
          console.log("[CHAT STREAM] Tool results:", toolResults.length);
          for (const toolResult of toolResults) {
            console.log("[CHAT STREAM] Tool result for:", toolResult.toolName, "- success:", !toolResult.isError);
          }

          if (response && ctx.userId) {
            console.log("[CHAT STREAM] Saving chat to database");
            waitUntil(processChat(ctx.userId, chats, message, response));
          } else if (!response) {
            console.error("[CHAT STREAM] ERROR: Empty response from AI model");
            controller.enqueue(
              encoder.encode(
                "I am unable to process your message. Please try again later.",
              ),
            );
          }
          controller.close();
        } catch (error) {
          console.error("[CHAT STREAM] Stream processing error:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          const errorMessage =
            "Sorry, something went wrong while generating a response. Please try again.";
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    return new NextResponse(transformedStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[CHAT ENDPOINT] Failed to create astrologer stream:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: ctx.userId,
      messagePreview: message.substring(0, 50),
    });
    return new NextResponse(
      "Sorry, something went wrong while starting the chat.",
      {
        status: 500,
      },
    );
  }
};
