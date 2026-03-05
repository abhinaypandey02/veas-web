import { NextRequest, NextResponse } from "next/server";
import { getAstrologerAssistant, processChat } from "../../utils";
import { db } from "@/app/api/lib/db";
import { ChatRole, ChatTable } from "../../db";
import { and, eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";
import { getContext } from "naystack/auth";
import { UserChartTable, UserRawChartTable, UserTable } from "../../../User/db";
import { decompressChartData } from "@/app/api/lib/charts/utils/compress";
import { ChatStreamRole } from "../../enum";
import { ERROR_MESSAGES, MAXIMUM_MESSAGES } from "../../constants";
import { getCorsHeaders } from "@/app/api/lib/cors";

const ALLOWED_ORIGINS = ["https://app.veasapp.com", "http://localhost:8081"];

export const OPTIONS = async (req: NextRequest) => {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req, ALLOWED_ORIGINS),
  });
};

export const POST = async (req: NextRequest) => {
  const corsHeaders = getCorsHeaders(req, ALLOWED_ORIGINS);
  const ctx = await getContext(req);
  if (!ctx?.userId)
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: corsHeaders,
    });
  const message = await req.text();

  const chats = await db
    .select()
    .from(ChatTable)
    .where(
      and(eq(ChatTable.isSummarized, false), eq(ChatTable.userId, ctx.userId)),
    )
    .orderBy(ChatTable.createdAt, ChatTable.id);

  if (chats.length >= MAXIMUM_MESSAGES.BETA * 2) {
    return new NextResponse(ERROR_MESSAGES.BETA, {
      status: 403,
      headers: corsHeaders,
    });
  }

  const [data] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId))
    .innerJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
    .innerJoin(
      UserRawChartTable,
      eq(UserTable.chartId, UserRawChartTable.chartId),
    );

  if (!data)
    return new NextResponse("User not found", {
      status: 404,
      headers: corsHeaders,
    });
  const { user_charts, user_raw_charts, users: user } = data;
  const chartData = await decompressChartData(user_raw_charts.rawChart);
  if (!chartData)
    return new NextResponse("Chart data not found", {
      status: 404,
      headers: corsHeaders,
    });

  let _controller: ReadableStreamDefaultController<Uint8Array>;
  const encoder = new TextEncoder();

  const astrologer = getAstrologerAssistant(
    user,
    user_charts,
    chartData,
    (message) => {
      _controller.enqueue(
        encoder.encode(getEncodedMessage(message, ChatStreamRole.Tool)),
      );
    },
    false,
  );

  let stream;
  try {
    stream = await astrologer.stream({
      messages: [
        ...chats.map((chat) => ({
          role:
            chat.role === ChatRole.Assistant
              ? (ChatRole.Assistant.toLowerCase() as "assistant")
              : (ChatRole.User.toLowerCase() as "user"),
          content: chat.message,
        })),
        { role: ChatRole.User.toLowerCase() as "user", content: message },
      ],
    });
  } catch (error) {
    console.error("Failed to create astrologer stream:", error);
    return new NextResponse(
      "Sorry, something went wrong while starting the chat.",
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }

  let response = "";

  const transformedStream = new ReadableStream({
    async start(controller) {
      _controller = controller;
      const reader = stream.textStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done && ctx.userId) {
            if (response)
              waitUntil(processChat(ctx.userId, chats, message, response));
            else {
              controller.enqueue(
                getEncodedMessage(
                  "I am not able to process your message. Please try again.",
                  ChatStreamRole.Error,
                ),
              );
            }
            controller.close();
            break;
          }

          // Accumulate the text
          response += value;

          // Forward the chunk to the client
          controller.enqueue(encoder.encode(getEncodedMessage(value)));
        }
      } catch (error) {
        console.error("Stream error:", error);
        // Instead of erroring the stream (which can leave the client hanging),
        // send a final friendly message and close the stream cleanly.
        const errorMessage =
          "Sorry, something went wrong while generating a response. Please try again.";
        controller.enqueue(
          encoder.encode(getEncodedMessage(errorMessage, ChatStreamRole.Error)),
        );
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new NextResponse(transformedStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...corsHeaders,
    },
  });
};

function getEncodedMessage(message: string | undefined, type?: ChatStreamRole) {
  return (
    JSON.stringify({
      message,
      type: type ?? ChatStreamRole.Response,
    }) + "\n"
  );
}
