import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const MessageModal = ({ selfData, userData }) => {
  const [message, setMessage] = useState("");
  const handleSendBtn = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/conversation/add-conversation`,
        { receiverId: userData?._id, message },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success(res?.data?.message);
        setMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mt-8 w-full h-[350px] overflow-auto pt-2">
      <div className="w-full mb-4">
        <label>Message</label>
        <br />
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="p-2 mt-1 w-full border-1 rounded-md "
          cols={10}
          rows={10}
          placeholder="write your message.."
        ></textarea>
      </div>

      <button
        onClick={handleSendBtn}
        className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
      >
        Send
      </button>
      <ToastContainer className=""/>
    </div>
  );
};

export default MessageModal;
