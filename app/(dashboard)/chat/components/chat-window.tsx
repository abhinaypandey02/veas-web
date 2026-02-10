"use client";

import { useToken } from "naystack/auth/email/client";
import { useState, useRef, useEffect } from "react";
import { QueryResponseType } from "naystack/graphql";
import type getChats from "@/app/api/(graphql)/Chat/resolvers/get-chats";
import { ChatRole } from "@/app/api/(graphql)/Chat/enum";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import Form from "@/components/form";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/components/utils";
import Loader from "@/components/loader";
export function ChatWindow({
  data,
}: {
  data?: QueryResponseType<typeof getChats>;
}) {
  const previousChats = data || [];
  const token = useToken();
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
  const message = form.watch("message");
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chats.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

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

    fetch("/api/Chat/send-chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: userMessage,
    })
      .then(async (res) => {
        if (!res.body) {
          throw new Error("No response body");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            // Decode the chunk and accumulate
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            // Update the assistant message incrementally
            setChats((prev) =>
              prev.map((chat) =>
                chat.createdAt === assistantMessageId
                  ? { ...chat, message: accumulatedText }
                  : chat,
              ),
            );
          }
        } catch (error) {
          console.error("Stream error:", error);
          // Update the message with error state if needed
          setChats((prev) =>
            prev.map((chat) =>
              chat.createdAt === assistantMessageId
                ? { ...chat, message: accumulatedText + "\n[Error occurred]" }
                : chat,
            ),
          );
        } finally {
          reader.releaseLock();
        }
      })
      .catch((error) => {
        console.error("Request error:", error);
        setChats((prev) =>
          prev.map((chat) =>
            chat.createdAt === assistantMessageId
              ? { ...chat, message: "[Error: Failed to send message]" }
              : chat,
          ),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col grow min-h-0">
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
                    >
                      {message || (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1 h-1 bg-current/60 rounded-full animate-pulse" />
                          <span className="w-1 h-1 bg-current/60 rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-1 bg-current/60 rounded-full animate-pulse delay-150" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )),
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <Form form={form} onSubmit={handleSendMessage} className="p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto relative">
          <div className="flex-1 relative">
            <Input
              disabled={isLoading}
              autoFocus
              name="message"
              placeholder={isLoading ? "typing..." : "Type your message..."}
              rows={1}
              className="ring-primary bg-gray-50"
            />
          </div>
          {isLoading ? (
            <div className="size-6 absolute right-4 top-1/2 -translate-y-1/2">
              <Loader />
            </div>
          ) : (
            message?.trim() && (
              <button
                className=" absolute right-4 top-1/2 -translate-y-1/2"
                type="submit"
                disabled={isLoading}
              >
                <ArrowRightIcon size={24} weight="light" />
              </button>
            )
          )}
        </div>
      </Form>
    </div>
  );
}
