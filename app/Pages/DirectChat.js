import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const DirectChat = ({ route }) => {
  const navigation = useNavigation();
  const {
    currentUserId,
    otherUserId,
    otherUserName = "Conversation",
    chatId,
    complaintId,
    allowReply = true,
  } = route.params || {};

  const [conversationId, setConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const [chatStatus, setChatStatus] = useState(null);

  // 🔥 Create or fetch chat doc
  const getOrCreateChat = async (currentUserId, otherUserId) => {
    const sortedIds = [currentUserId, otherUserId].sort();
    const chatIdField = chatId || sortedIds.join("_");

    const chatsRef = collection(db, "chats");

    // Check if chat already exists
    const q = query(chatsRef, where("chatId", "==", chatIdField));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return existing.docs[0].id; // existing chat doc ID
    }

    // Create a new chat doc with auto ID
    const newChat = await addDoc(chatsRef, {
      chatId: chatIdField,
      users: sortedIds,
      createdAt: serverTimestamp(),
      complaintId: complaintId || null,
      status: "pending",
      lastMessage: "",
      lastMessageAt: null,
      updatedAt: Date.now(),
    });

    return newChat.id;
  };

  // Load or create chat
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    getOrCreateChat(currentUserId, otherUserId)
      .then(setConversationId)
      .catch(console.error);
  }, [currentUserId, otherUserId]);

  // Listen for messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, "chats", conversationId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const chatRef = doc(db, "chats", conversationId);
    const unsub = onSnapshot(chatRef, (snap) => {
      const data = snap.data();
      setChatStatus(data?.status || null);
    });
    return () => unsub();
  }, [conversationId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const trimmed = messageText.trim();
    const canReply = allowReply && (chatStatus || "").toLowerCase() !== "resolved";
    if (!trimmed || !conversationId || !canReply) return;

    setMessageText("");

    try {
      await addDoc(collection(db, "chats", conversationId, "messages"), {
        text: trimmed,
        senderId: currentUserId,
        recipientId: otherUserId,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "chats", conversationId), {
        lastMessage: trimmed,
        lastMessageAt: new Date().toISOString(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageRow,
          isCurrentUser ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              !isCurrentUser && styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTimestamp,
              !isCurrentUser && styles.otherMessageTimestamp,
            ]}
          >
            {formatTimestamp(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color="#538cc6" />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="chatbubbles-outline" size={48} color="#bbb" />
        <Text style={styles.emptyStateText}>Start the conversation</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{otherUserName}</Text>
          <Text style={styles.headerSubtitle}>
            Chatting as{" "}
            <Text style={styles.headerHighlight}>{currentUserId || "Unknown"}</Text>
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messageList,
          messages.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder={
            allowReply && (chatStatus || "").toLowerCase() !== "resolved"
              ? "Type your message..."
              : "Replies disabled for this complaint"
          }
          placeholderTextColor="#999"
          multiline
          editable={allowReply && (chatStatus || "").toLowerCase() !== "resolved"}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageText.trim() || !(allowReply && (chatStatus || "").toLowerCase() !== "resolved")) && {
              opacity: 0.5,
            },
          ]}
          onPress={handleSend}
          disabled={
            !messageText.trim() || !(allowReply && (chatStatus || "").toLowerCase() !== "resolved")
          }
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f3f8" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#538cc6",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  headerSubtitle: { marginTop: 4, fontSize: 14, color: "rgba(255,255,255,0.85)" },
  headerHighlight: { fontWeight: "600" },
  messageList: { paddingHorizontal: 16, paddingVertical: 10 },
  messageRow: { flexDirection: "row", marginBottom: 8 },
  messageRowLeft: { justifyContent: "flex-start" },
  messageRowRight: { justifyContent: "flex-end" },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    elevation: 1,
  },
  currentUserBubble: { backgroundColor: "#2c5aa0", borderBottomRightRadius: 4 },
  otherUserBubble: { backgroundColor: "#fff", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: "#fff" },
  otherMessageText: { color: "#1c1b1f" },
  messageTimestamp: {
    marginTop: 6,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  otherMessageTimestamp: { color: "#6c757d" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyStateText: { marginTop: 12, fontSize: 16, color: "#888" },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e6ed",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f2f4f8",
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2c5aa0",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DirectChat;
