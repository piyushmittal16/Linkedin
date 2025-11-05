import { useState, useEffect, React } from "react";
import ProfileCard from "../../components/profileCard/ProfileCard";
import axios from "axios";

function MyNetwork() {
  const [showContent, setShowContent] = useState("Catch Up with friends");
  const [data, setData] = useState([]);

  const handleFriendsButton = () => {
    setShowContent("Catch Up with friends");
  };
  const handlePendingButton = () => {
    setShowContent("Pending Request");
  };

  const fetchFriendList = async () => {
    await axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/friendlist`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data.friends))
      .catch(() => alert("Something Went Wrong"));
  };

  const fetchPendingFriendList = async () => {
    await axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/pendingfriendlist`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data.pendingFriends))
      .catch(() => alert("Something Went Wrong"));
  };

  useEffect(() => {
    if (showContent === "Catch Up with friends") fetchFriendList();
    else fetchPendingFriendList();
  }, [showContent]);

  return (
    <div className="px-4 sm:px-6 lg:px-16 py-9 flex flex-col gap-5 w-full mt-5 bg-gray-100">
      {/* ---------------- Header Section ---------------- */}
      <div className="py-4 px-4 sm:px-8 border border-gray-300 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-lg sm:text-xl bg-white rounded-xl shadow-sm">
        <div className="text-center sm:text-left font-semibold text-gray-800">
          {showContent}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center sm:justify-end flex-wrap">
          <button
            onClick={handleFriendsButton}
            className={`px-3 py-1 rounded-lg text-sm sm:text-base border ${
              showContent === "Catch Up with friends"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Friends
          </button>
          <button
            onClick={handlePendingButton}
            className={`px-3 py-1 rounded-lg text-sm sm:text-base border ${
              showContent === "Pending Request"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            Pending Request
          </button>
        </div>
      </div>

      {/* ---------------- Cards Section ---------------- */}
      <div className="flex flex-wrap gap-5 justify-center items-start w-full h-auto">
        {data.length === 0 ? (
          <div className="text-gray-500 text-center py-10 text-sm sm:text-base">
            {showContent === "Catch Up with friends"
              ? "No friends yet."
              : "No pending friend requests."}
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[23%] h-[270px]"
            >
              <ProfileCard data={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyNetwork;
