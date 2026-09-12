import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { AuthContext } from "./AuthContext.jsx";
import { toast } from "react-toastify";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeConId, setActiveConId] = useState(null);
  const [unreadMap, setUnreadMap] = useState({}); // { [conversationId]: unreadCount }
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      fetchConversations();
    }
  }, [user]);

  // 📥 Fetch all conversations for current user
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/get-conversation`,
        { withCredentials: true }
      );
      const convos = res?.data?.conversations || [];

      // Initialize unread counts map from DB
      const initialMap = {};
      convos.forEach((c) => {
        if (c._id) {
          initialMap[c._id] = c.unreadCount || 0;
          socket.emit("joinConversation", c._id);
        }
      });
      setUnreadMap(initialMap);
      setConversations(convos);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  // 💬 Fetch messages and mark as seen
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/${conversationId}`,
        { withCredentials: true }
      );
      setMessages(res?.data?.message || []);

      // Clear unread indicator for this conversation immediately
      setUnreadMap((prev) => ({ ...prev, [conversationId]: 0 }));
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );

      // 👁️ Mark messages as seen in DB & notify sender via socket (fire and forget, non-blocking)
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/api/message/seen/${conversationId}`,
          {},
          { withCredentials: true }
        )
        .catch(() => {});

      if (user?._id) {
        socket.emit("conversationSeen", conversationId, user._id);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // 📤 Send message with instant Optimistic UI update (0ms perceived delay)
  const sendMessage = async (conversationId, messageText, picture, receiverId) => {
    // 1. Generate optimistic message for instant display
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticMsg = {
      _id: tempId,
      sender: user,
      conversation: conversationId,
      message: messageText || "",
      picture: picture || null,
      createdAt: new Date().toISOString(),
      isSeen: false,
      isPending: true,
    };

    // 2. Add to messages immediately
    setMessages((prev) => [...prev, optimisticMsg]);

    // 3. Immediately reorder conversation list: Move active conversation to top
    setConversations((prev) => {
      const found = prev.find((c) => c._id === conversationId);
      if (!found) return prev;
      const updated = {
        ...found,
        lastMessage: messageText || (picture ? "📷 Photo" : ""),
        lastMessageTime: new Date().toISOString(),
      };
      const rest = prev.filter((c) => c._id !== conversationId);
      return [updated, ...rest];
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message`,
        {
          conversation: conversationId,
          message: messageText,
          picture,
        },
        { withCredentials: true }
      );

      const savedMsg = res.data;

      // 4. Replace optimistic message with backend-confirmed message
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? savedMsg : msg))
      );

      // 5. Emit to conversation room & direct receiver
      socket.emit("sendMessage", conversationId, savedMsg, receiverId);
    } catch (err) {
      console.error("Error sending message:", err);
      // Rollback optimistic message on failure
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      const errMsg =
        err?.response?.data?.error ||
        "Failed to send message. Please verify you are connected with this user.";
      toast.error(errMsg);
    }
  };

  // ⚡ Real-time Socket Event Handlers
  useEffect(() => {
    // Incoming message in active conversation room
    const handleMessageReceived = (newMessage) => {
      if (!newMessage) return;
      const convoId =
        typeof newMessage.conversation === "object"
          ? newMessage.conversation._id
          : newMessage.conversation;

      if (convoId === activeConId) {
        setMessages((prev) => [...prev, newMessage]);
        // Mark seen automatically if chat is open
        if (user?._id && newMessage.sender?._id !== user._id) {
          socket.emit("conversationSeen", convoId, user._id);
        }
      } else {
        // Increment unread count (green dot)
        setUnreadMap((prev) => ({
          ...prev,
          [convoId]: (prev[convoId] || 0) + 1,
        }));
      }

      // Update conversations list in real-time
      setConversations((prev) => {
        const found = prev.find((c) => c._id === convoId);
        if (!found) return prev;
        const updated = {
          ...found,
          lastMessage: newMessage.message || (newMessage.picture ? "📷 Photo" : ""),
          lastMessageTime: newMessage.createdAt || new Date().toISOString(),
        };
        const rest = prev.filter((c) => c._id !== convoId);
        return [updated, ...rest];
      });
    };

    // Seen status event: Receiver opened our messages
    const handleConversationSeen = (data) => {
      const convoId = data?.conversationId || data;
      if (convoId && String(convoId) === String(activeConId)) {
        setMessages((prev) =>
          prev.map((msg) => ({ ...msg, isSeen: true }))
        );
      }
    };

    socket.on("messageReceived", handleMessageReceived);
    socket.on("newConversationMessage", (data) => {
      if (data?.message) handleMessageReceived(data.message);
    });
    socket.on("conversationSeen", handleConversationSeen);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
      socket.off("newConversationMessage");
      socket.off("conversationSeen", handleConversationSeen);
    };
  }, [activeConId, user]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        fetchConversations,
        fetchMessages,
        sendMessage,
        activeConId,
        setActiveConId,
        unreadMap,
        setUnreadMap,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
