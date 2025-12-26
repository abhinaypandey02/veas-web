import { NextRequest, NextResponse } from "next/server";
import { getAstrologerAssistant, processChat } from "../../utils";
import { db } from "@/app/api/lib/db";
import { ChatRole, ChatTable } from "../../db";
import { and, eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";
import { getContext } from "../../../route";

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
  const astrologer = getAstrologerAssistant(ctx.userId);
  const stream = await astrologer.stream({
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
      const reader = stream.textStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            waitUntil(processChat(ctx.userId, chats, message, response));
            controller.close();
            break;
          }

          // Accumulate the text
          response += value;

          // Forward the chunk to the client
          controller.enqueue(encoder.encode(value));
        }
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new NextResponse(transformedStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
