import React, { useState, useEffect, useContext } from "react";
import "./NavbarV2.css";
import logo from "../../assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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
  const [mobileSearchActive, setMobileSearchActive] = useState(false); // 🌟 NEW STATE

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
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/findUser?query=${debouncedTerm}`,
        { withCredentials: true }
      );
      setSearchUser(res?.data?.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseSearch = () => {
    setMobileSearchActive(false);
    setSearchTerm("");
    setDebouncedTerm("");
    setSearchUser([]);
  };

  return (
    <div className="bg-white h-13 flex justify-between items-center py-1 px-4 xl:px-50 fixed top-0 w-full shadow-sm z-50 transition-all duration-300">
      {/* 🔹 Left: Logo + Search */}
      <div className="flex gap-2 items-center">
        <Link to="/feeds">
          <img src={logo} alt="LinkedIn" className="w-8 h-8" />
        </Link>

        {/* Desktop Search */}
        <div className="relative hidden sm:block">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            className="searchInput w-70 bg-gray-100 rounded-sm h-10 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="Search"
          />
          {debouncedTerm.length > 0 && (
            <div className="absolute w-88 left-0 top-11 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 divide-y divide-gray-100">
              {searchUser.length > 0 ? (
                searchUser.map((item, index) => (
                  <Link
                    to={`/profile/${item?._id}`}
                    key={index}
                    className="flex gap-3 items-center p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSearchTerm("");
                      setDebouncedTerm("");
                      setSearchUser([]);
                    }}
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      src={item?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item?.f_name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item?.headline || "LinkedIn Member"}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-400">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Right: Navigation Icons */}
      <div
        className={`flex gap-6 sm:gap-10 items-center transition-all duration-300 ${
          mobileSearchActive ? "hidden sm:flex" : "flex"
        }`}
      >
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

        {/* 🔔 Notification */}
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

        <Link
          to={user?._id ? `/profile/${user._id}` : "#"}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            className="w-10 h-10 rounded-full border"
            src={user?.profile_pic}
            alt="profile"
          />
        </Link>

        {/* 🔍 Mobile Search Icon */}
        <button
          onClick={() => setMobileSearchActive(true)}
          className="sm:hidden"
        >
          <SearchIcon />
        </button>
      </div>

      {/* 🔎 Mobile Search Mode */}
      {mobileSearchActive && (
        <div className="fixed left-0 top-0 w-full bg-white z-50 shadow-md sm:hidden flex flex-col">
          <div className="flex items-center px-3 py-2.5 border-b border-gray-200">
            <input
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              type="text"
              placeholder="Search users..."
              className="flex-grow bg-gray-100 rounded-md px-4 py-2 focus:outline-none text-sm"
            />
            <button onClick={handleCloseSearch} className="ml-2 text-gray-600 p-1">
              <CloseIcon />
            </button>
          </div>

          {/* 🔍 Mobile Search Results List */}
          {debouncedTerm.length > 0 && (
            <div className="w-full max-h-[70vh] overflow-y-auto bg-white divide-y divide-gray-100 shadow-xl">
              {searchUser.length > 0 ? (
                searchUser.map((item, index) => (
                  <Link
                    to={`/profile/${item?._id}`}
                    key={index}
                    className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={handleCloseSearch}
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      src={item?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item?.f_name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item?.headline || "LinkedIn Member"}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No users found for "{debouncedTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
