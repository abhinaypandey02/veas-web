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
import { Card } from "../components/Card";
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
  const suggestions = [
    "How will this week feel for me?",
    "What should I focus on today?",
    "Any insight for a big decision this month?",
  ];

  useEffect(() => {
    if (!data) return;
    const hydrated: ChatItem[] = data
      // ignore summarized system entries if they come through
      .filter((chat) => chat.role === "user" || chat.role === "assistant")
      .map((chat) => ({
      id: `${chat.createdAt}-${chat.role}`,
      role: (chat.role === "user" ? "user" : "assistant") as ChatItem["role"],
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
    
    const screenId = Math.random().toString(36).substring(7);
    console.log(`\n[SCREEN ${screenId}] 🖥️  Chat screen send triggered`);
    console.log(`[SCREEN ${screenId}] 📝 Message: "${trimmed}"`);
    
    setInput("");
    setIsSending(true);

    const assistantId = `assistant-${Date.now()}`;
    console.log(`[SCREEN ${screenId}] 🤖 Assistant ID: ${assistantId}`);
    
    setMessages((prev) => {
      const updated = [
        ...prev,
        { id: `user-${Date.now()}`, role: "user", message: trimmed },
        { id: assistantId, role: "assistant", message: "" },
      ];
      console.log(`[SCREEN ${screenId}] 📊 Messages count: ${updated.length}`);
      return updated;
    });

    try {
      console.log(`[SCREEN ${screenId}] 🚀 Calling streamChatMessage...`);
      await streamChatMessage(trimmed, (text) => {
        console.log(`[SCREEN ${screenId}] 📤 Received chunk: ${text.length} chars`);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, message: text } : msg,
          ),
        );
      });
      console.log(`[SCREEN ${screenId}] ✅ Stream complete`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      console.error(`[SCREEN ${screenId}] ❌ Error:`, error);
      console.error(`[SCREEN ${screenId}] 📋 Error message: ${errorMsg}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, message: `[Error] ${errorMsg}` }
            : msg,
        ),
      );
    } finally {
      setIsSending(false);
      console.log(`[SCREEN ${screenId}] 👋 Send finished`);
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
          contentContainerClassName="px-5 pt-6 pb-6 space-y-5"
        >
          <View className="space-y-1">
            <Text className="text-xs uppercase tracking-[0.36em] text-muted">
              Veas AI
            </Text>
            <Text className="text-2xl font-serif text-foreground">
              Your astrology companion
            </Text>
            <Text className="text-sm text-muted">
              Grounded guidance, translated for modern life.
            </Text>
          </View>
          {messages.length === 0 ? (
            <View className="space-y-4">
              <View className="items-center justify-center pt-12">
                <Text className="text-lg font-serif text-foreground">
                  Start a conversation
                </Text>
                <Text className="text-sm text-muted mt-2 text-center">
                  Ask about your chart, a future date, or how today might feel.
                </Text>
              </View>
              <View className="space-y-2">
                {suggestions.map((prompt) => (
                  <Pressable key={prompt} onPress={() => setInput(prompt)}>
                    <Card className="py-3 px-4" variant="soft">
                      <Text className="text-sm text-foreground">{prompt}</Text>
                    </Card>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-foreground self-end"
                    : "bg-white/90 border border-foreground/10 self-start"
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
              className="flex-1 bg-white/90 border border-foreground/10 rounded-2xl px-4 py-3 text-foreground"
              placeholder={placeholder}
              placeholderTextColor="#9B98A1"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <Pressable
              className={`px-4 py-3 rounded-full ${
                isSending || !input.trim() ? "bg-foreground/30" : "bg-foreground"
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
