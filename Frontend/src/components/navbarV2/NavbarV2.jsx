import React, { useState, useEffect, useContext } from "react";
import "./NavbarV2.css";
import logo from "../../assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext.jsx";

const NavbarV2 = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { notificationCount } = useContext(NotificationContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  // 🔁 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔍 Search API call
  useEffect(() => {
    if (debouncedTerm) searchAPICall();
  }, [debouncedTerm]);

  const searchAPICall = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/auth/findUser?query=${debouncedTerm}`,
        { withCredentials: true }
      );
      setSearchUser(res?.data?.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white h-13 flex justify-between items-center py-1 px-4 xl:px-50 fixed  top-0 w-full shadow-sm z-50">
      {/* 🔹 Left: Logo + Search */}
      <div className="flex gap-2 items-center">
        <Link to="/feeds">
          <img src={logo} alt="LinkedIn" className="w-8 h-8" />
        </Link>

        {/* Search Bar (hidden on small screens) */}
        <div className="relative hidden sm:block">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="searchInput w-70 bg-gray-100 rounded-sm h-10 px-4"
            placeholder="Search"
          />
          {searchUser.length > 0 && debouncedTerm.length > 0 && (
            <div className="absolute w-88 left-0 bg-gray-200">
              {searchUser.map((item, index) => (
                <Link
                  to={`/profile/${item?._id}`}
                  key={index}
                  className="flex gap-2 mb-1 items-center p-2 hover:bg-gray-300 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                >
                  <img
                    className="w-11 h-10 rounded-full"
                    src={item?.profile_pic}
                    alt=""
                  />
                  <div>{item?.f_name}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Right: Navigation Icons */}
      <div className="flex gap-6 sm:gap-10 items-center">
        {/* ✅ Common Nav Item Component */}
        <NavItem
          to="/feeds"
          icon={<HomeIcon />}
          label="Home"
          active={location.pathname === "/feeds"}
        />
        <NavItem
          to="/mynetwork"
          icon={<GroupIcon />}
          label="Network"
          active={location.pathname === "/mynetwork"}
        />
        <NavItem
          to="/resume"
          icon={<WorkIcon />}
          label="Resume"
          active={location.pathname === "/resume"}
        />
        <NavItem
          to="/message"
          icon={<MessageIcon />}
          label="Message"
          active={location.pathname === "/message"}
        />

        {/* 🔔 Notification Icon */}
        <Link
          to="/notification"
          className="relative flex flex-col items-center cursor-pointer"
        >
          <div>
            <NotificationsActiveIcon
              sx={{
                color: location.pathname === "/notification" ? "black" : "gray",
              }}
            />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-2 p-[3px] text-xs rounded-full bg-red-600 text-white">
                {notificationCount}
              </span>
            )}
          </div>
          <span className="hidden sm:block text-sm text-gray-500">
            Notification
          </span>
        </Link>

        {/* 👤 Profile */}
        <Link
          to={`/profile/${user?._id}`}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            className="w-10 h-10 rounded-full border"
            src={user?.profile_pic}
            alt="profile"
          />
        </Link>
      </div>
    </div>
  );
};

// 🔸 Small reusable component for nav item
const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className="flex flex-col items-center cursor-pointer">
    <div>
      {React.cloneElement(icon, { sx: { color: active ? "black" : "gray" } })}
    </div>
    <div
      className={`hidden sm:block text-sm text-gray-500 ${
        active ? "border-b-2 border-black" : ""
      }`}
    >
      {label}
    </div>
  </Link>
);

export default NavbarV2;
