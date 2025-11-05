import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { AuthContext } from "./AuthContext.jsx";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeConId, setActiveConId] = useState(null);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    await axios
      .get("http://localhost:4000/api/conversation/get-conversation", {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res?.data?.conversations || []);
        // setActiveConId(res?.data?.conversations[0]?._id);
        const convos = res?.data?.conversations || [];
        setConversations(convos);

        socket.emit("joinConversation", res?.data?.conversations[0]?._id);

        if (convos.length > 0) {
          socket.emit("joinConversation", convos[0]?._id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchMessages = async (conversationId) => {
    await axios
      .get(`http://localhost:4000/api/message/${conversationId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res?.data?.message || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = async (conversationId, messageText, picture) => {
    await axios
      .post(
        "http://localhost:4000/api/message",
        {
          conversation: conversationId,
          message: messageText,
          picture,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [...prev, res?.data]);
        socket.emit("sendMessage", conversationId, res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socket.on("messageReceived", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.off("messageReceived");
    };
  }, []);

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
