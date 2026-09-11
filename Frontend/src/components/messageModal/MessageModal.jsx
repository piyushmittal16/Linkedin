import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MessageModal = ({ selfData, userData, closeModal }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendBtn = async () => {
    if (!message.trim()) {
      toast.warning("Message cannot be empty!");
      return;
    }

    setSending(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/add-conversation`,
        { receiverId: userData?._id, message },
        { withCredentials: true }
      );

      toast.success(res?.data?.message || "Message sent successfully!");
      setMessage("");
      if (closeModal) closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between pt-2">
      {/* 💬 Message Input */}
      <div className="w-full mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          To: <span className="text-blue-700 font-bold">{userData?.f_name}</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          rows={5}
          placeholder="Write your message..."
        ></textarea>
      </div>

      {/* 🚀 Send Button */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={handleSendBtn}
          disabled={sending}
          className="bg-blue-600 text-white font-medium py-1.5 px-6 cursor-pointer hover:bg-blue-700 rounded-full transition-all text-sm disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

