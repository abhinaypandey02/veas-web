import { NextRequest, NextResponse } from "next/server";
import { getAstrologerAssistant, processChat } from "../../utils";
import { db } from "@/app/api/lib/db";
import { ChatRole, ChatTable } from "../../db";
import { and, eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";
import { getContext } from "naystack/auth";
import { UserChartTable, UserRawChartTable, UserTable } from "../../../User/db";
import { decompressChartData } from "@/app/api/lib/charts/utils/compress";

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

  const [data] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.userId))
    .innerJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
    .innerJoin(
      UserRawChartTable,
      eq(UserChartTable.rawChartId, UserRawChartTable.id),
    );

  if (!data) return new NextResponse("User not found", { status: 404 });
  const { user_charts, user_raw_charts, users: user } = data;
  const chartData = await decompressChartData(user_raw_charts.rawChart);
  if (!chartData)
    return new NextResponse("Chart data not found", { status: 404 });
  const astrologer = getAstrologerAssistant(user, user_charts, chartData);

  let stream;
  try {
    stream = await astrologer.stream({
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
  } catch (error) {
    console.error("Failed to create astrologer stream:", error);
    return new NextResponse(
      "Sorry, something went wrong while starting the chat.",
      {
        status: 500,
      },
    );
  }

  let response = "";
  const encoder = new TextEncoder();

  const transformedStream = new ReadableStream({
    async start(controller) {
      const reader = stream.textStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done && ctx.userId) {
            if (response)
              waitUntil(processChat(ctx.userId, chats, message, response));
            else {
              controller.enqueue(
                encoder.encode(
                  "I am not able to process your message. Please try again.",
                ),
              );
            }
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
        // Instead of erroring the stream (which can leave the client hanging),
        // send a final friendly message and close the stream cleanly.
        const errorMessage =
          "Sorry, something went wrong while generating a response. Please try again.";
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
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
