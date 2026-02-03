import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { Screen } from "../components/Screen";
import { streamChatMessage } from "../services/chat";
import { useChats } from "../services/user";

export type ChatItem = {
  id: string;
  role: "assistant" | "user";
  message: string;
};

export function ChatScreen() {
  const { data } = useChats(true);
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!data) return;
    const hydrated = data.map((chat) => ({
      id: `${chat.createdAt}-${chat.role}`,
      role: chat.role === "user" ? "user" : "assistant",
      message: chat.message,
    }));
    setMessages(hydrated);
  }, [data]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput("");
    setIsSending(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", message: trimmed },
      { id: assistantId, role: "assistant", message: "" },
    ]);

    try {
      await streamChatMessage(trimmed, (text) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, message: text } : msg,
          ),
        );
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, message: "Something went wrong. Please try again." }
            : msg,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const placeholder = useMemo(() => {
    if (messages.length) return "Type your message...";
    return "Ask about today, your year, or a specific date.";
  }, [messages.length]);

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerClassName="px-5 pt-6 pb-6 space-y-4"
        >
          {messages.length === 0 ? (
            <View className="h-72 items-center justify-center">
              <Text className="text-lg font-serif text-foreground">Start a conversation</Text>
              <Text className="text-sm text-muted mt-2 text-center">
                Ask about your chart, a future date, or how today might feel.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-foreground self-end"
                    : "bg-surface border border-foreground/10 self-start"
                }`}
              >
                {message.role === "user" ? (
                  <Text className="text-white text-sm leading-relaxed">
                    {message.message}
                  </Text>
                ) : (
                  <Markdown
                    style={{
                      body: { color: "#1A1A1A", fontSize: 14, fontFamily: "VeasSerif" },
                    }}
                  >
                    {message.message || "…"}
                  </Markdown>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <View className="border-t border-foreground/10 px-5 py-4 bg-background">
          <View className="flex-row items-center gap-3">
            <TextInput
              className="flex-1 bg-surface border border-foreground/10 rounded-2xl px-4 py-3 text-foreground"
              placeholder={placeholder}
              placeholderTextColor="#9B98A1"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <Pressable
              className={`px-4 py-3 rounded-full ${
                isSending || !input.trim() ? "bg-foreground/40" : "bg-foreground"
              }`}
              onPress={handleSend}
              disabled={isSending || !input.trim()}
            >
              <Text className="text-white text-sm">Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
