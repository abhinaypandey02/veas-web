"use client";

import { ChatRole, GetChatsQuery } from "@/__generated__/graphql";
import { useToken } from "naystack/graphql/client";
import { useState, useRef, useEffect } from "react";

export function ChatWindow({
  previousChats,
}: {
  previousChats: GetChatsQuery["getChats"];
}) {
  const token = useToken();
  const [chats, setChats] = useState(previousChats);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    const assistantMessageId = Date.now() - 1;

    setChats((prev) => [
      ...prev,
      {
        message: userMessage,
        createdAt: Date.now(),
        role: ChatRole.User,
      },
      {
        message: "",
        createdAt: assistantMessageId,
        role: ChatRole.Assistant,
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
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Request error:", error);
        setIsLoading(false);
        setChats((prev) =>
          prev.map((chat) =>
            chat.createdAt === assistantMessageId
              ? { ...chat, message: "[Error: Failed to send message]" }
              : chat,
          ),
        );
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-foreground/60">
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Ask me anything about your Vedic chart!</p>
            </div>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.createdAt + chat.role}
              className={`flex ${
                chat.role === ChatRole.User ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  chat.role === ChatRole.User
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap wrap-break-word">
                  {chat.message || (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse delay-75" />
                      <span className="w-2 h-2 bg-current rounded-full animate-pulse delay-150" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4"
        >
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-foreground placeholder:text-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  maxHeight: "120px",
                  minHeight: "48px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
