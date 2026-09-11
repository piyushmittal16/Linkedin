import React, { useState, useEffect, useContext } from "react";
import Advertisement from "../../components/advertisment/Advertisement.jsx";
import ProfileCard from "../../components/profileCard/ProfileCard";
import Conversation from "../../components/editModal/conversation/Conversation.jsx";
import Card from "../../components/card/Card.jsx";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { NotificationContext } from "../../context/NotificationContext.jsx";
const Notify = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    markAsRead,
    fetchNotificationCount,
    notifications,
    setNotifications,
  } = useContext(NotificationContext);
  useEffect(() => {
    fetchNotificationData();
  }, []);
  const fetchNotificationData = async () => {
    await axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/notification`, {
        withCredentials: true,
      })
      .then((res) => {
        setNotifications(res?.data?.notification);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnclickNotification = async (item) => {
    markAsRead(item?._id);
    fetchNotificationCount();
    setNotifications((prev) =>
      prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
    );
    if (item?.type === "comment") {
      navigate(`/profile/${item?.sender?._id}/activities/${item?.postId}`);
    } else {
      navigate(`/profile/${item?.sender?._id}`);
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 md:px-8 xl:px-24 flex justify-center bg-gray-100">
      <div className="flex justify-between gap-5 w-full max-w-6xl">
        {/*Left side */}
        <div className="w-[24%] hidden md:block">
          <div className="h-fit">
            <ProfileCard data={user} />
          </div>
          <div className="w-full my-5">
            <Card padding={1}>
              <div className="w-full flex justify-between ">
                <div>Profile Viewers</div>
                <div className="text-blue-900">23</div>
              </div>
              <div className="w-full flex justify-between ">
                <div>Post Impression</div>
                <div className="text-blue-900">90</div>
              </div>
            </Card>
          </div>
        </div>

        {/*Middle side*/}
        <div className="flex flex-col w-full md:w-[72%] lg:w-[48%] border border-gray-200 rounded-2xl overflow-auto h-[90vh] bg-white">
        <div className="flex flex-col w-[100%] py-5 ">
          <div>
            <Card padding={0}>
              <div className="w-full">
                {/* For each Notification*/}
                {notifications?.map((item, index) => {
                  return (
                    <div
                      onClick={() => handleOnclickNotification(item)}
                      key={index}
                      className={`border-b-1 cursor-pointer flex gap-4 items-center border-gray-300 p-3 ${
                        item?.isRead ? "bg-gray-200" : "bg-blue-100"
                      }`}
                    >
                      <img
                        src={item?.sender?.profile_pic}
                        className="w-12 h-12 rounded-[100%] cursor-pointer"
                      />
                      <div>{item?.content}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/*Right side */}
      <div className="w-[24%] hidden lg:block">
        <div>
          <Card padding={1}>
            <div className="text-xl">LinkedIn News</div>
            <div className="text-gray-600">Top Stories</div>
            <div className="my-1">
              <div className="text-md">Buffer to remain Berkshire chair </div>
              <div className="text-xs text-gray-400 ">2h ago</div>
            </div>

            <div className="my-1">
              <div className="text-md">Foreign investments surge again </div>
              <div className="text-xs text-gray-400 ">3h ago</div>
            </div>
          </Card>
        </div>

        <div className="sticky my-5 top-19">
          <Advertisement />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Notify;
