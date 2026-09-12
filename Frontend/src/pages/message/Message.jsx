import React, { useState, useEffect, useContext, useRef } from "react";
import Advertisement from "../../components/advertisment/Advertisement";
import Card from "../../components/card/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Conversation from "../../components/editModal/conversation/Conversation.jsx";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../../socket.js";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext.jsx";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { formatMessageTime } from "../../utils/formatTime";

const Message = () => {
  const { user } = useContext(AuthContext);
  const {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    activeConId,
    setActiveConId,
  } = useContext(ChatContext);

  const [selectedConDetails, setSelectedConDetails] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set default active conversation on mount
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConId) {
      const firstCon = conversations[0];
      setActiveConId(firstCon._id);
      const otherMember = firstCon.members?.find((m) => m._id !== user?._id);
      setSelectedConDetails(otherMember);
    }
  }, [conversations]);

  // When conversation selection changes
  const handleSelectedCon = (id, member) => {
    setActiveConId(id);
    setSelectedConDetails(member);
    setIsMobileChatOpen(true);
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConId) {
      fetchMessages(activeConId);
    }
  }, [activeConId]);

  // 📷 Cloudinary image upload (safe native fetch, no CORS ERR_FAILED)
  const handleInputImage = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const secureUrl = await uploadToCloudinary(files[0]);
      setImageLink(secureUrl);
      toast.success("Image attached successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // ✉️ Send message with connection check
  const handleSendMessageBtn = () => {
    if (!activeConId) {
      toast.error("Please select a conversation first");
      return;
    }
    if (!messageText.trim() && !imageLink) {
      return;
    }

    // Check if user is connected
    const isConnected =
      !selectedConDetails?._id ||
      user?.friends?.some(
        (f) => String(f._id || f) === String(selectedConDetails._id)
      );

    if (!isConnected) {
      toast.error(
        `You are no longer connected with ${selectedConDetails?.f_name || "this user"}. Please reconnect to send messages.`
      );
      return;
    }

    sendMessage(
      activeConId,
      messageText,
      imageLink,
      selectedConDetails?._id
    );
    setMessageText("");
    setImageLink(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageBtn();
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 md:px-8 xl:px-24 flex justify-center">
      <div className="w-full max-w-6xl flex justify-between gap-5">
        {/* Left / Main Section */}
        <div className="w-full lg:w-[72%]">
          <Card padding={0}>
            {/* Header */}
            <div className="border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center bg-white rounded-t-xl">
              <div className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                Messaging
              </div>
              <div className="py-1 px-3 bg-emerald-700 hover:bg-emerald-800 font-medium flex items-center gap-1 text-xs rounded-full text-white cursor-pointer transition-colors">
                Focused <ArrowDropDownIcon fontSize="small" />
              </div>
            </div>

            {/* Content Area: Responsive Master-Detail Grid */}
            <div className="flex w-full min-h-[550px] max-h-[750px] bg-white rounded-b-xl overflow-hidden">
              {/* 1. Conversations List Column */}
              <div
                className={`${
                  isMobileChatOpen ? "hidden md:block" : "block"
                } w-full md:w-[40%] border-r border-gray-200 flex flex-col`}
              >
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    All Conversations
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 h-[480px] sm:h-[550px]">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((item, index) => (
                      <Conversation
                        key={index}
                        handleSelectedCon={handleSelectedCon}
                        activeConId={activeConId}
                        item={item}
                        ownData={user}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400 gap-2 h-full">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        💬
                      </div>
                      <p className="font-medium text-gray-600 text-sm">
                        No conversations yet
                      </p>
                      <p className="text-xs text-gray-400 max-w-xs">
                        Visit someone's profile to send your first message and connect!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Chat Conversation Column */}
              <div
                className={`${
                  !isMobileChatOpen ? "hidden md:flex" : "flex"
                } w-full md:w-[60%] flex-col justify-between bg-white`}
              >
                {/* Chat Top Header */}
                {selectedConDetails ? (
                  <div className="border-b border-gray-200 py-2.5 px-4 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Back button visible only on mobile screens */}
                      <button
                        onClick={() => setIsMobileChatOpen(false)}
                        className="md:hidden p-1.5 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                        title="Back to conversation list"
                      >
                        <ArrowBackIcon fontSize="small" />
                      </button>

                      <Link
                        to={`/profile/${selectedConDetails?._id}`}
                        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={
                            selectedConDetails?.profile_pic ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          className="rounded-full w-10 h-10 object-cover border border-gray-200"
                          alt="profile"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 leading-tight">
                            {selectedConDetails?.f_name}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px] sm:max-w-xs">
                            {selectedConDetails?.headline || "LinkedIn Member"}
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="text-gray-500 cursor-pointer p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizIcon fontSize="small" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400 border-b border-gray-200 text-sm bg-gray-50 shrink-0">
                    Select a conversation to start messaging
                  </div>
                )}

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/40 h-[360px] sm:h-[420px]">
                  {selectedConDetails && messages && messages.length > 0 ? (
                    messages.map((item, index) => {
                      const isSelf =
                        (typeof item?.sender === "object"
                          ? item?.sender?._id
                          : item?.sender) === user?._id;

                      return (
                        <div
                          key={index}
                          className={`flex gap-2.5 max-w-[85%] ${
                            isSelf ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          <img
                            src={
                              (typeof item?.sender === "object"
                                ? item?.sender?.profile_pic
                                : selectedConDetails?.profile_pic) ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                            alt=""
                          />
                          <div
                            className={`rounded-2xl px-3.5 py-2 text-sm shadow-xs ${
                              isSelf
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                            }`}
                          >
                            {item?.message && (
                              <p className="whitespace-pre-wrap break-words leading-relaxed">
                                {item.message}
                              </p>
                            )}
                            {item?.picture && (
                              <div className="mt-2">
                                <img
                                  src={item.picture}
                                  alt="attachment"
                                  className="max-w-[220px] max-h-[180px] rounded-lg object-cover"
                                />
                              </div>
                            )}

                            {/* 🕒 Timestamp & Seen checkmarks ✓✓ */}
                            <div
                              className={`flex items-center gap-1 mt-1 text-[10px] ${
                                isSelf
                                  ? "text-blue-100 justify-end"
                                  : "text-gray-400 justify-start"
                              }`}
                            >
                              <span>{formatMessageTime(item?.createdAt)}</span>
                              {isSelf && (
                                <span
                                  className={`font-bold ml-0.5 tracking-tighter text-xs ${
                                    item?.isSeen ? "text-cyan-200" : "text-blue-200"
                                  }`}
                                  title={item?.isSeen ? "Seen" : "Delivered"}
                                >
                                  ✓✓
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : selectedConDetails ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                      <p>No messages yet.</p>
                      <p className="text-xs text-gray-400">Say hello to break the ice! 👋</p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                      <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl mb-2">
                        ✉️
                      </div>
                      <p className="font-semibold text-gray-600">Your Messages</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Select a chat from the left to start a conversation.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ⚠️ Disconnected Notice (if users removed friend) */}
                {selectedConDetails?._id &&
                  user?.friends &&
                  !user.friends.some(
                    (f) => String(f._id || f) === String(selectedConDetails._id)
                  ) && (
                    <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-200 text-amber-900 text-xs flex items-center gap-2 shrink-0">
                      <span>
                        ⚠️ You are no longer connected with <strong>{selectedConDetails?.f_name}</strong>. Reconnect on their profile to send messages.
                      </span>
                    </div>
                  )}

                {/* Attached Image Preview */}
                {imageLink && (
                  <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center gap-2 shrink-0">
                    <img
                      src={imageLink}
                      alt="preview"
                      className="w-12 h-12 object-cover rounded-md border border-gray-300"
                    />
                    <span className="text-xs text-gray-600">Attached image</span>
                    <button
                      onClick={() => setImageLink(null)}
                      className="ml-auto text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-200"
                      title="Remove image"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                )}

                {/* Loading state for attachment */}
                {loading && (
                  <div className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs flex items-center gap-2 shrink-0">
                    <span>Uploading attachment...</span>
                  </div>
                )}

                {/* Message Input Box */}
                <div className="p-3 border-t border-gray-200 bg-white shrink-0">
                  <div className="relative">
                    <textarea
                      value={messageText}
                      disabled={
                        !activeConId ||
                        (selectedConDetails?._id &&
                          user?.friends &&
                          !user.friends.some(
                            (f) => String(f._id || f) === String(selectedConDetails._id)
                          ))
                      }
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      placeholder={
                        selectedConDetails?._id &&
                        user?.friends &&
                        !user.friends.some(
                          (f) => String(f._id || f) === String(selectedConDetails._id)
                        )
                          ? "Messaging disabled (Disconnected)"
                          : activeConId
                          ? "Write a message... (Press Enter to send)"
                          : "Select a conversation first"
                      }
                      className="w-full bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm p-3 pr-20 resize-none transition-all"
                    ></textarea>

                    <div className="absolute right-2 bottom-2.5 flex items-center gap-2">
                      <label
                        htmlFor="messageImage"
                        className={`${
                          activeConId
                            ? "cursor-pointer text-gray-500 hover:text-blue-600"
                            : "cursor-not-allowed text-gray-300"
                        } p-1 rounded-full hover:bg-gray-200 transition-colors`}
                        title="Attach image"
                      >
                        <ImageIcon fontSize="small" />
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!activeConId}
                        onChange={handleInputImage}
                        id="messageImage"
                        className="hidden"
                      />

                      <button
                        onClick={handleSendMessageBtn}
                        disabled={
                          !activeConId ||
                          (!messageText.trim() && !imageLink) ||
                          loading ||
                          (selectedConDetails?._id &&
                            user?.friends &&
                            !user.friends.some(
                              (f) => String(f._id || f) === String(selectedConDetails._id)
                            ))
                        }
                        className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Send message"
                      >
                        <SendIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section: Advert / Profile */}
        <div className="hidden lg:flex lg:w-[26%] flex-col gap-4">
          <div className="sticky top-18">
            <Advertisement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
