import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useState, useEffect, useRef } from "react";
import apiClient from "../../api/client";
import { Ionicons } from "@expo/vector-icons";
import { View as _LGView } from "react-native";
const LinearGradient = ({ style, children, colors, start, end }: any) => (
  <_LGView
    style={[
      style,
      colors && colors.length > 0 ? { backgroundColor: colors[0] } : {},
    ]}
  >
    {children}
  </_LGView>
);

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const clearChat = async () => {
    if (messages.length === 0) return;
    try {
      await apiClient.delete("/chat");
      setMessages([]);
      Toast.show({
        type: "success",
        text1: "Chat cleared",
        text2: "You can start a new conversation now.",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to clear chat.",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await apiClient.post("/chat", { message: input });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.message },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Tab bar height — used for static bottom padding so input sits above tab bar
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 85 : 70;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? insets.top + 44  
          : 0
      }
    >
      <View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "#E0F2FE" }]}
      />
      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.circle1]} />
      <View style={[styles.decorCircle, styles.circle2]} />
      <View style={[styles.decorCircle, styles.circle3]} />

      {/* Local Action Bar for Chat */}
      <View style={styles.chatActionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={clearChat}>
          <Ionicons name="add-circle-outline" size={20} color="#4facfe" />
          <Text
            style={[
              styles.actionButtonText,
              { color: "#4facfe", fontWeight: "bold" },
            ]}
          >
            New Chat
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={[
          styles.chatContent,
          messages.length === 0 && styles.emptyChatContent,
        ]}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.iconContainer}>
              <Ionicons name="leaf" size={48} color="#4facfe" />
            </View>
            <Text style={styles.emptyStateTitle}>Your Safe Space</Text>
            <Text style={styles.emptyStateText}>
              I'm here to listen, support you, and help you navigate your
              feelings without judgment. What's on your mind today?
            </Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === "user" ? styles.userText : styles.aiText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))
        )}

        {isTyping && (
          <View
            style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}
          >
            <ActivityIndicator
              size="small"
              color="#4facfe"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.typingText}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.inputArea,
          { paddingBottom: TAB_BAR_HEIGHT },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.sendButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name="send"
              size={18}
              color="#fff"
              style={{ marginLeft: 2 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.15,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: "#4facfe",
    top: -80,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: "#00f2fe",
    bottom: 100,
    left: -60,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: "#FDF2F8",
    bottom: -30,
    right: 40,
    opacity: 0.3,
  },
  chatActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 120 : 100, // Pad for global navbar
    paddingBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  actionButtonText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyChatContent: {
    flexGrow: 1,
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    marginHorizontal: 20,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.15)",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: "#4facfe",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.1)",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  typingText: {
    color: "#64748B",
    fontSize: 14,
    fontStyle: "italic",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: "#ffffff",
  },
  aiText: {
    color: "#1E293B",
  },
  inputArea: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "rgba(79, 172, 254, 0.2)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "flex-end",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 15,
  },
  clearButton: {
    padding: 10,
    marginRight: 4,
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    maxHeight: 120,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#D6E8F7",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    marginLeft: 12,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
