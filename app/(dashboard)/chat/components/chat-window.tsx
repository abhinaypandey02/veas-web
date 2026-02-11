"use client";

import { useState, useRef, useEffect } from "react";
import { QueryResponseType } from "naystack/graphql";
import type getChats from "@/app/api/(graphql)/Chat/resolvers/get-chats";
import { ChatRole } from "@/app/api/(graphql)/Chat/enum";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import Form from "@/components/form";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/components/utils";
import { renderRichText } from "../utils";
import { useStreaming } from "./streaming";
import { ERROR_MESSAGES } from "@/app/api/(graphql)/Chat/constants";
import FeedbackModal from "@/components/feedback-modal";
import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";

export function ChatWindow({
  data,
}: {
  data?: {
    user: QueryResponseType<typeof getCurrentUser>;
    chats: QueryResponseType<typeof getChats>;
  };
}) {
  const previousChats = data?.chats || [];
  const [chats, setChats] = useState<
    {
      message: string;
      createdAt: Date;
      role: ChatRole;
    }[]
  >(previousChats);
  const form = useForm<{ message: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [toolMessages, setToolMessages] = useState<string[]>([]);
  const [toolMessage, setToolMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [firstTouch, setFirstTouch] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  useEffect(() => {
    const lastToolMessage = toolMessages[0];
    setToolMessage(lastToolMessage);
    const timeout = setTimeout(() => {
      if (toolMessages.length <= 1) return;
      setToolMessages((prev) => prev.slice(1));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [toolMessages]);

  const message = form.watch("message");
  const stream = useStreaming("/api/Chat/send-chat");
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if (data?.chats && data.chats.length === 0) {
      setFeedbackOpen(true);
    }
  }, [data]);

  // Focus input when loading becomes false
  useEffect(() => {
    if (!isLoading) {
      form.setFocus("message");
    }
  }, [isLoading, form]);

  const handleSendMessage = (data: { message: string }) => {
    if (!data.message.trim() || isLoading) return;
    form.reset({ message: "" });

    const userMessage = data.message.trim();
    setIsLoading(true);
    const userDate = new Date();
    const assistantMessageId = new Date(userDate.getTime() + 1000);

    setChats((prev) => [
      ...prev,
      {
        message: userMessage,
        createdAt: userDate,
        role: ChatRole.user,
      },
      {
        message: "",
        createdAt: assistantMessageId,
        role: ChatRole.assistant,
      },
    ]);
    stream(userMessage, {
      onTool: (message) => {
        setToolMessages((prev) => [...prev, message]);
      },
      onResponse: (message) => {
        setFirstTouch(true);
        setToolMessages([]);
        setErrorMessage(undefined);
        setChats((prev) =>
          prev.map((chat) =>
            chat.createdAt === assistantMessageId
              ? { ...chat, message: chat.message + message }
              : chat,
          ),
        );
      },
      onError: (message) => {
        if (message === ERROR_MESSAGES.BETA) {
          setFeedbackOpen(true);
          return;
        }
        setErrorMessage(message);
      },
      onComplete: () => {
        setFirstTouch(false);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="flex flex-col grow min-h-0">
      <FeedbackModal
        open={feedbackOpen}
        close={() => setFeedbackOpen(false)}
        name={data?.user?.name || ""}
      />
      {/* Messages Area */}
      <div className="grow flex flex-col overflow-y-auto px-4 pt-6 space-y-4">
        {chats.length === 0 ? (
          <div className="flex grow items-center justify-center ">
            <div className="text-center text-foreground/60">
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Ask me anything about your Vedic chart!</p>
            </div>
          </div>
        ) : (
          chats.map((chat) =>
            chat.message
              .split("\n\n")
              .map((line) => line.trim())
              .map((message, i) => (
                <div
                  key={chat.createdAt + chat.role + i}
                  className={`flex ${
                    chat.role === ChatRole.user
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] px-3 py-1 text-sm ${
                      chat.role !== ChatRole.user
                        ? "bg-white text-foreground border "
                        : "bg-primary/90 text-white "
                    }`}
                  >
                    <div
                      className={cn(
                        "whitespace-pre-wrap wrap-break-word ",
                        chat.role !== ChatRole.user
                          ? "font-serif text-s3m"
                          : "text-white text-sm3",
                      )}
                      dangerouslySetInnerHTML={
                        message
                          ? {
                              __html: renderRichText(message),
                            }
                          : undefined
                      }
                    >
                      {!message ? (
                        <span className="inline-flex items-end gap-1 italic">
                          {toolMessage
                            ? `👀 ${toolMessage}`
                            : firstTouch
                              ? "🧐 analysing..."
                              : "just a sec..."}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )),
          )
        )}

        <div ref={messagesEndRef} />
      </div>
      {errorMessage && (
        <div className="flex justify-start text-red-600 items-center gap-1 px-4">
          <div className="font-serif text-sm  ">
            {renderRichText(errorMessage)}
          </div>
        </div>
      )}

      {chats.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 sm:px-0 max-w-4xl mx-auto w-full">
          {[
            "Am I dating the right person? 👀",
            "When will I get rich? 💸",
            "What's my secret superpower? ✨",
            "Is someone thinking about me rn? 🤭",
            "What should I do with my life? 🌀",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="w-full md:w-auto px-3 py-1.5 text-sm border border-dashed border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              onClick={() => {
                handleSendMessage({ message: suggestion });
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <Form form={form} onSubmit={handleSendMessage} className="p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto relative">
          <div className="flex-1 relative">
            <Input
              loading={isLoading}
              disabled={isLoading}
              autoFocus
              name="message"
              placeholder={
                isLoading
                  ? toolMessage
                    ? `👀 ${toolMessage}`
                    : firstTouch
                      ? "🧐 analysing..."
                      : "thinking..."
                  : "type your message..."
              }
              rows={1}
              className="ring-primary bg-gray-50"
            />
          </div>
          {isLoading
            ? null
            : message?.trim() && (
                <button
                  className=" absolute right-4 top-1/2 -translate-y-1/2"
                  type="submit"
                  disabled={isLoading}
                >
                  <ArrowRightIcon size={24} weight="light" />
                </button>
              )}
        </div>
      </Form>
    </div>
  );
}
