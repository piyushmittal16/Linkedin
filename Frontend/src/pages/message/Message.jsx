import React, { useState, useEffect, useContext, useRef } from "react";
import Advertisement from "../../components/advertisment/Advertisement";
import Card from "../../components/card/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Conversation from "../../components/editModal/conversation/Conversation.jsx";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import socket from "../../../socket.js";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext.jsx";
const Message = () => {
  // const [conversations, setConversations] = useState([]);
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
  // const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLink, setImageLink] = useState(null);
  const [messageText, setMessageText] = useState("");

  const ref = useRef();
  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectedCon = (id, userData) => {
    setActiveConId(id);
    socket.emit("joinConversation", id);
    setSelectedConDetails(userData);
    fetchMessages(id);
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Auto-select first conversation if available and none selected yet
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConId && user) {
      const firstCon = conversations[0];
      const otherUser = firstCon?.members?.find((m) => {
        const mId = typeof m === "object" ? m?._id : m;
        return mId !== user?._id;
      });
      handleSelectedCon(firstCon?._id, otherUser);
    }
  }, [conversations, user]);

  useEffect(() => {
    if (activeConId) {
      fetchMessages(activeConId);
    }
  }, [activeConId]);

  const handleInputImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);

    data.append("upload_preset", "linkedinClone");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duwvyiocv/image/upload",
        data,
        { withCredentials: false }
      );
      const imageUrl = response.data.secure_url;
      setImageLink(imageUrl);
    } catch (error) {
      console.log({ message: "modal uploadImage error", error });
      alert("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageBtn = () => {
    if (!activeConId) {
      toast.error("Please select a conversation first");
      return;
    }
    if (!messageText.trim() && !imageLink) {
      return;
    }
    sendMessage(activeConId, messageText, imageLink);
    setMessageText("");
    setImageLink(null);
  };

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {conversations ? (
        <div className="w-full justify-between flex pt-5">
          {/*Left Side */}

          <div className="w-full md:w-[70%]">
            <Card padding={0}>
              <div className="border-b-1 border-gray-300 px-5 py-2 font-semibold text-lg">
                Messaging
              </div>
              <div className="border-b-1 border-gray-300 px-5 py-2">
                <div className="py-1 px-3 cursor-pointer hover:bg-green-900 bg-green-800 font-semibold flex gap-2 w-fit rounded-2xl text-white">
                  Focused <ArrowDropDownIcon />
                </div>

                {/*Div for Chat */}
              </div>
              <div className="md:flex w-full">
                {/*Left-Left-Side Section */}
                <div className="h-[500px] overflow-auto w-full md:w-[40%] border-r-1 border-gray-400">
                  {/*For Each Chat */}

                  {conversations && conversations.length > 0 ? (
                    conversations.map((item, index) => {
                      return (
                        <Conversation
                          handleSelectedCon={handleSelectedCon}
                          activeConId={activeConId}
                          item={item}
                          key={index}
                          ownData={user}
                        />
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No conversations yet
                    </div>
                  )}
                </div>

                {/*Left-Right-Side Section */}

                <div className="w-full md:w-[60%] border-gray-400">
                  {selectedConDetails ? (
                    <div className="border-gray-300 py-2 px-4 border-b-2 flex justify-between items-center">
                      <Link
                        to={`/profile/${selectedConDetails?._id}`}
                        className="w-full gap-3 p-2 flex flex-row items-center hover:bg-gray-50 rounded"
                      >
                        <img
                          src={selectedConDetails?.profile_pic}
                          className="rounded-full w-14 h-14 cursor-pointer"
                          alt="profile"
                        />

                        <div className="my-1">
                          <div className="text-md font-semibold text-gray-900">
                            {selectedConDetails?.f_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedConDetails?.headline || ""}
                          </div>
                        </div>
                      </Link>
                      <div>
                        <MoreHorizIcon />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400 border-b-2 border-gray-200">
                      Select a conversation to start messaging
                    </div>
                  )}

                  <div className="h-[360px] w-full overflow-auto border-b-1 border-gray-300">
                    <div className="w-full">
                      {/*For Each Messages */}
                      {messages
                        ? messages?.map((item, index) => {
                          return (
                            <div
                              ref={ref}
                              key={index}
                              className="flex w-full cursor-pointer border-gray-300 gap-3 p-4"
                            >
                              <div className="shrink-0">
                                <img
                                  src={item?.sender?.profile_pic}
                                  className="w-8 h-8 rounded-[100%] cursor-pointer"
                                />
                              </div>
                              <div className="mb-2 w-full">
                                <div className="text-md">
                                  {item?.sender?.f_name}
                                </div>
                                <div className="text-sm mt-6 hover:bg-gray-200">
                                  {item?.message}
                                </div>
                                {item?.picture && (
                                  <div className="my-2">
                                    <img
                                      src={item?.picture}
                                      className="w-[240px] h-[180px] rounded-md"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                        : null}
                    </div>
                  </div>

                  {/*messages Writing Section */}

                  <div className="p-2 w-full border-b-1 border-gray-200">
                    <textarea
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                      }}
                      rows={4}
                      placeholder="write your message"
                      className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3"
                    ></textarea>
                  </div>

                  <div className="p-3 flex justify-between">
                    <div>
                      <label htmlFor="messageImage" className="cursor-pointer">
                        <ImageIcon />
                      </label>
                      <input
                        type="file"
                        onChange={handleInputImage}
                        id="messageImage"
                        className="hidden"
                      />
                    </div>
                    {!loading && (
                      <div
                        className="p-3 py-1 cursor-pointer rounded-2xl border-1 bg-blue-950 text-white"
                        onClick={handleSendMessageBtn}
                      >
                        Send
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/*Right-Side */}

          <div className="hidden md:flex md:w-[25%]">
            <div className="sticky top-19">
              <Advertisement />
            </div>
          </div>
        </div>
      ) : (
        "No Conversations"
      )}

      <ToastContainer />
    </div>
  );
};

export default Message;
