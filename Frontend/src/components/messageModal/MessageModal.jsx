import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MessageModal = ({ selfData, userData }) => {
  const [message, setMessage] = useState("");

  const handleSendBtn = async () => {
    if (!message.trim()) {
      toast.warning("Message cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/add-conversation`,
        { receiverId: userData?._id, message },
        { withCredentials: true }
      );

      toast.success(res?.data?.message || "Message sent successfully!");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div
      className="mt-8 w-full h-[350px] overflow-auto pt-2 flex flex-col justify-between"
      style={{ position: "relative" }}
    >
      {/* 💬 Message Input */}
      <div className="w-full mb-4">
        <label className="font-semibold text-gray-700">Message</label>
        <br />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          cols={10}
          rows={10}
          placeholder="Write your message..."
        ></textarea>
      </div>

      {/* 🚀 Send Button */}
      <button
        onClick={handleSendBtn}
        className="bg-blue-600 text-white w-fit py-1 px-4 cursor-pointer hover:bg-blue-800 rounded-2xl transition-all self-start"
      >
        Send
      </button>

      {/* ✅ Toast Container always on top of navbar */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastStyle={{
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
        }}
        style={{
          zIndex: 9999, // 👈 Keeps toast above navbar
          top: "0",
        }}
      />
    </div>
  );
};

export default MessageModal;
