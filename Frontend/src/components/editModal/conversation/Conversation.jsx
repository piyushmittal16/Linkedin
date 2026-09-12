import React, { useState, useEffect, useContext } from "react";
import { formatMessageTime } from "../../../utils/formatTime";
import { ChatContext } from "../../../context/ChatContext";

const Conversation = ({ item, ownData, handleSelectedCon, activeConId }) => {
  const [memberData, setMemberData] = useState(null);
  const { unreadMap } = useContext(ChatContext);

  useEffect(() => {
    let ownId = ownData?._id;
    let arr = item?.members?.filter((it) => it._id !== ownId);
    setMemberData(arr ? arr[0] : null);
  }, [ownData, item]);

  const unreadCount =
    (item?._id && unreadMap && unreadMap[item._id] !== undefined)
      ? unreadMap[item._id]
      : (item?.unreadCount || 0);
  const isSelected = activeConId === item?._id;

  const handleClickFunc = () => {
    handleSelectedCon(item?._id, memberData);
  };

  return (
    <div
      onClick={handleClickFunc}
      className={`flex items-center justify-between w-full cursor-pointer border-b border-gray-100 p-3.5 transition-colors ${
        isSelected ? "bg-blue-50/80 border-l-4 border-l-blue-600" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* 👤 Avatar with online/active indicator */}
        <div className="relative shrink-0">
          <img
            src={
              memberData?.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={memberData?.f_name || "User"}
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          {/* 🟢 Green dot for unread messages */}
          {unreadCount > 0 && (
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-200"
              title={`${unreadCount} unread message(s)`}
            ></span>
          )}
        </div>

        {/* 📝 Name & Last message / Headline snippet */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4
              className={`text-sm truncate ${
                unreadCount > 0
                  ? "font-bold text-gray-900"
                  : isSelected
                  ? "font-semibold text-blue-900"
                  : "font-semibold text-gray-800"
              }`}
            >
              {memberData?.f_name || "LinkedIn User"}
            </h4>
            {item?.lastMessageTime && (
              <span className={`text-[11px] shrink-0 ml-1 ${unreadCount > 0 ? "text-emerald-700 font-semibold" : "text-gray-400"}`}>
                {formatMessageTime(item.lastMessageTime)}
              </span>
            )}
          </div>

          <p
            className={`text-xs truncate mt-0.5 ${
              unreadCount > 0
                ? "font-semibold text-gray-900"
                : "text-gray-500"
            }`}
          >
            {item?.lastMessage || memberData?.headline || "No messages yet"}
          </p>
        </div>
      </div>

      {/* 🟢 Unread Count Badge */}
      {unreadCount > 0 && (
        <div className="flex flex-col items-end justify-center ml-2 shrink-0">
          <span className="min-w-5.5 h-5.5 px-1.5 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
          <span className="text-[9px] text-emerald-700 font-bold tracking-wider uppercase mt-0.5">
            New
          </span>
        </div>
      )}
    </div>
  );
};

export default Conversation;
