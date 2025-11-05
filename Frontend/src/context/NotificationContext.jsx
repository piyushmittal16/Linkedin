import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);
  const fetchNotificationCount = async () => {
    await axios
      .get("http://localhost:4000/api/notification/activeNotification", {
        withCredentials: true,
      })
      .then((res) => {
        setNotificationCount(res?.data?.count || 0);
      })
      .catch((err) => {
        console.log(err);
        alert("Notification can't get");
      });
  };

  const markAsRead = async (notificationId) => {
    await axios
      .put(`http://localhost:4000/api/notification/isRead`, {
        notificationId,
      })
      .then((res) => {
        setNotificationCount((prev) => Math.max(prev - 1, 0));
      })
      .catch((err) => {
        console.log(err);
        alert("Notification can't get");
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
