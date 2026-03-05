import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthQuery, useAuthMutation } from "naystack/graphql/client";
import { ChatRole } from "@/__generated__/graphql";
import { MAXIMUM_MESSAGES, ERROR_MESSAGES } from "@/constants/chat";
import { GET_CHATS, GET_CURRENT_USER } from "@/constants/graphql/queries";
import { SUBMIT_FEEDBACK } from "@/constants/graphql/mutations";
import { useStreaming } from "@/hooks/use-streaming";
import { parseRichText } from "@/utils/chat";
import { Fonts } from "@/constants/theme";

interface ChatMessage {
  message: string;
  createdAt: number;
  role: string;
}

const SUGGESTIONS = [
  "Is my ex stalking me? 👀",
  "Why is my love life a mess? 💀",
  "Is someone thinking about me rn? 🤭",
  "Will I marry rich or cry rich? 😭",
  "Why does my family always judge me? 🙄",
  "When is the money coming in? 💰",
];

const SATISFACTION_OPTIONS = [
  { label: "1 - Very Unsatisfied", value: "1" },
  { label: "2 - Unsatisfied", value: "2" },
  { label: "3 - Neutral", value: "3" },
  { label: "4 - Satisfied", value: "4" },
  { label: "5 - Very Satisfied", value: "5" },
];

export default function ChatScreen() {
  const [getChats, { data: chatsData }] = useAuthQuery(GET_CHATS);
  const [getUser, { data: userData }] = useAuthQuery(GET_CURRENT_USER);
  const [submitFeedback, { loading: feedbackLoading }] =
    useAuthMutation(SUBMIT_FEEDBACK);

  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toolMessages, setToolMessages] = useState<string[]>([]);
  const [toolMessage, setToolMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [firstTouch, setFirstTouch] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const stream = useStreaming("/Chat/send-chat");

  // Fetch initial data
  useEffect(() => {
    getChats();
    getUser();
  }, []);

  // Set initial chats from GraphQL data
  useEffect(() => {
    if (chatsData?.getChats && !initialLoaded) {
      const mapped = chatsData.getChats.map((c) => ({
        message: c.message,
        createdAt: c.createdAt,
        role: c.role,
      }));
      setChats(mapped);
      setInitialLoaded(true);
      if (mapped.length === 0) {
        setFeedbackOpen(true);
      }
    }
  }, [chatsData, initialLoaded]);

  // Tool message rotation (2s timeout)
  useEffect(() => {
    const lastToolMessage = toolMessages[0];
    setToolMessage(lastToolMessage);
    const timeout = setTimeout(() => {
      if (toolMessages.length <= 1) return;
      setToolMessages((prev) => prev.slice(1));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [toolMessages]);

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chats.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chats, toolMessage]);

  const handleSendMessage = useCallback(
    (text?: string) => {
      const msg = (text || message).trim();
      if (!msg || isLoading) return;

      setMessage("");
      Keyboard.dismiss();
      setIsLoading(true);

      const userDate = Date.now();
      const assistantDate = userDate + 1000;

      setChats((prev) => [
        ...prev,
        {
          message: msg,
          createdAt: userDate,
          role: ChatRole.User,
        },
        {
          message: "",
          createdAt: assistantDate,
          role: ChatRole.Assistant,
        },
      ]);

      stream(msg, {
        onTool: (toolMsg) => {
          setToolMessages((prev) => [...prev, toolMsg]);
        },
        onResponse: (responseMsg) => {
          setFirstTouch(true);
          setToolMessages([]);
          setErrorMessage(undefined);
          setChats((prev) =>
            prev.map((chat) =>
              chat.createdAt === assistantDate
                ? { ...chat, message: chat.message + responseMsg }
                : chat,
            ),
          );
        },
        onError: (errMsg) => {
          if (errMsg === ERROR_MESSAGES.FREE_TIER_LIMIT_REACHED) {
            setFeedbackOpen(true);
            return;
          } else {
            setErrorMessage(errMsg);
          }
        },
        onComplete: () => {
          setFirstTouch(false);
          setIsLoading(false);
        },
      });
    },
    [message, isLoading, chats.length, stream],
  );

  const handleFeedbackSubmit = async () => {
    if (!feedbackScore) return;
    try {
      await submitFeedback({
        score: parseInt(feedbackScore),
        text: feedbackText || undefined,
      });
      setFeedbackSubmitted(true);
    } catch {
      // silently handle
    }
  };

  const closeFeedback = () => {
    setFeedbackOpen(false);
    setShowFeedbackForm(false);
    setFeedbackSubmitted(false);
    setFeedbackScore("");
    setFeedbackText("");
  };

  const userName = userData?.getCurrentUser?.name || "";

  const renderMessageBubble = (
    chat: ChatMessage,
    paragraphIndex: number,
    paragraph: string,
  ) => {
    const isUser = chat.role === ChatRole.User;

    return (
      <View
        key={`${chat.createdAt}-${chat.role}-${paragraphIndex}`}
        style={[
          styles.messageBubbleContainer,
          isUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          {paragraph ? (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.assistantText,
              ]}
            >
              {parseRichText(paragraph)}
            </Text>
          ) : (
            <Text
              style={[styles.messageText, styles.assistantText, styles.italic]}
            >
              {toolMessage
                ? `👀 ${toolMessage}`
                : firstTouch
                  ? "🧐 analysing..."
                  : "just a sec..."}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Flatten chats into renderable items (split by \n\n)
  const renderItems = chats.flatMap((chat) => {
    const paragraphs = chat.message.split("\n\n").map((line) => line.trim());
    // If message is empty (loading state), still render one item
    if (
      paragraphs.length === 0 ||
      (paragraphs.length === 1 && paragraphs[0] === "")
    ) {
      return [{ chat, paragraphIndex: 0, paragraph: "" }];
    }
    return paragraphs.map((paragraph, i) => ({
      chat,
      paragraphIndex: i,
      paragraph,
    }));
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        {/* Messages */}
        {chats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about your Vedic chart!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={renderItems}
            keyExtractor={(item) =>
              `${item.chat.createdAt}-${item.chat.role}-${item.paragraphIndex}`
            }
            renderItem={({ item }) =>
              renderMessageBubble(
                item.chat,
                item.paragraphIndex,
                item.paragraph,
              )
            }
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {/* Error message */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{parseRichText(errorMessage)}</Text>
          </View>
        ) : null}

        {/* Suggestions (empty state) */}
        {chats.length === 0 ? (
          <ScrollView
            horizontal={false}
            style={styles.suggestionsContainer}
            contentContainerStyle={styles.suggestionsContent}
          >
            {SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestionButton}
                onPress={() => handleSendMessage(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {/* Input bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder={
                isLoading
                  ? firstTouch
                    ? "🧐 analysing..."
                    : "thinking..."
                  : "Type your message..."
              }
              placeholderTextColor="#999"
              editable={!isLoading}
              multiline
              returnKeyType="send"
              onSubmitEditing={() => handleSendMessage()}
              blurOnSubmit
            />
            {isLoading ? (
              <View style={styles.sendButton}>
                <ActivityIndicator size="small" color="#1a1a1a" />
              </View>
            ) : message.trim() ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleSendMessage()}
              >
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Extra space for bottom tab bar */}
        <View style={{ height: 80 }} />
      </KeyboardAvoidingView>

      {/* Feedback Modal */}
      <Modal
        visible={feedbackOpen}
        transparent
        animationType="fade"
        onRequestClose={closeFeedback}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>We love you ❤️</Text>

            <Text style={styles.modalText}>
              Dear {userName.split(" ")[0]},{"\n"}Thanks a lot for using our
              app! This means so much to us 🥳
              {"\n"}We are currently in <Text style={styles.bold}>beta</Text>{" "}
              and improving our app. We need your feedback to make this
              experience better!
            </Text>

            <Text style={styles.modalText}>
              Oh and also, we only allow{" "}
              <Text style={styles.bold}>
                {MAXIMUM_MESSAGES.FREE_TIER} messages per user
              </Text>{" "}
              for now. If you need more, please let us know :D
            </Text>

            <Text style={styles.modalText}>With love,{"\n"}Veas team</Text>

            {!showFeedbackForm && !feedbackSubmitted ? (
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setShowFeedbackForm(true)}
                  style={styles.feedbackLink}
                >
                  <Text style={styles.feedbackLinkText}>💬 Give Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeFeedback}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {showFeedbackForm && !feedbackSubmitted ? (
              <View style={styles.feedbackForm}>
                <Text style={styles.feedbackLabel}>How satisfied are you?</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.scoresRow}
                >
                  {SATISFACTION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.scoreButton,
                        feedbackScore === opt.value &&
                          styles.scoreButtonSelected,
                      ]}
                      onPress={() => setFeedbackScore(opt.value)}
                    >
                      <Text
                        style={[
                          styles.scoreButtonText,
                          feedbackScore === opt.value &&
                            styles.scoreButtonTextSelected,
                        ]}
                      >
                        {opt.value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Any thoughts or suggestions..."
                  placeholderTextColor="#999"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!feedbackScore || feedbackLoading) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleFeedbackSubmit}
                  disabled={!feedbackScore || feedbackLoading}
                >
                  {feedbackLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}

            {feedbackSubmitted ? (
              <View>
                <Text style={styles.feedbackSuccess}>
                  Thank you for your feedback!
                </Text>
                <TouchableOpacity
                  onPress={closeFeedback}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    fontFamily: Fonts.serif,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageBubbleContainer: {
    marginBottom: 12,
  },
  messageBubbleRight: {
    alignItems: "flex-end",
  },
  messageBubbleLeft: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: "#1a1a1a",
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#FDFCF8",
    borderTopLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#FDFCF8",
  },
  assistantText: {
    color: "#1a1a1a",
    fontFamily: Fonts.serif,
  },
  italic: {
    fontStyle: "italic",
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontFamily: Fonts.serif,
  },
  suggestionsContainer: {
    maxHeight: 200,
    paddingHorizontal: 16,
  },
  suggestionsContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.2)",
  },
  suggestionText: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FDFCF8",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 22,
    color: "#1a1a1a",
    fontWeight: "300",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  feedbackLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackLinkText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  closeText: {
    fontSize: 14,
    color: "#999",
  },
  feedbackForm: {
    marginTop: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  scoresRow: {
    marginBottom: 12,
  },
  scoreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  scoreButtonSelected: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  scoreButtonText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  scoreButtonTextSelected: {
    color: "#fff",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#1a1a1a",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  feedbackSuccess: {
    fontSize: 14,
    fontWeight: "500",
    color: "#16a34a",
    marginTop: 8,
  },
  closeButton: {
    marginTop: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#999",
  },
});
