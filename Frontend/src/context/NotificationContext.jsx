import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";
import socket from "../../socket";
import { toast } from "react-toastify";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      fetchNotificationCount();

      // ⚡ Join user's personal room for instant socket alerts
      socket.emit("joinUser", user._id);

      // ⚡ Listen for real-time notifications (likes, comments, friend requests)
      const handleNewNotification = (newNotif) => {
        setNotificationCount((prev) => prev + 1);
        if (newNotif) {
          setNotifications((prev) => [newNotif, ...prev]);
          if (newNotif.content) {
            toast.info(`🔔 ${newNotif.content}`);
          }
        }
      };

      socket.on("newNotification", handleNewNotification);

      return () => {
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/activeNotification`,
        { withCredentials: true }
      );
      setNotificationCount(res?.data?.count || 0);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    await axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/api/notification/isRead`, {
        notificationId,
      })
      .then((res) => {
        setNotificationCount((prev) => Math.max(prev - 1, 0));
      })
      .catch((err) => {
        console.error("Error marking notification as read:", err);
      });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        fetchNotificationCount,
        markAsRead,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
