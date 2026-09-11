import React, { useState, useEffect, useContext } from "react";
import ProfileCard from "../../components/profileCard/ProfileCard";
import Card from "../../components/card/Card";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisement from "../../components/advertisment/Advertisement";
import Post from "../../components/post/Post.jsx";
import Modal from "../../components/modal/Modal";
import AddModal from "../../components/addModal/AddModal";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const Feeds = () => {
  const { user } = useContext(AuthContext);
  const [addPostModal, setAddPostModal] = useState(false);
  const [post, setPost] = useState([]);
  const fetchData = async () => {
    try {
      const [userData, postData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/self`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getallposts`),
      ]);
      setPost(postData.data.posts);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    // fetchSelfData();
    fetchData();
  }, []);

  const handleModalPost = () => {
    setAddPostModal((prev) => !prev);
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

        {/*Middle side */}
        <div className="w-full md:w-[72%] lg:w-[48%]">
        <div>
          {/*Post Section */}
          <Card padding={1}>
            <div className="flex gap-2 items-center">
              <img
                src={user?.profile_pic}
                alt="User Profile" // ✅ FIXED: Added alt attribute
                className="rounded-4xl w-13 h-13 border-white cursor-pointer"
              />
              <div
                onClick={() => {
                  setAddPostModal(true);
                }}
                className="w-full border-1 py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100 "
              >
                Start a post
              </div>
            </div>
            <div className="w-full flex mt-3">
              <div
                onClick={() => {
                  setAddPostModal(true);
                }}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <VideoCameraBackIcon sx={{ color: "green" }} />
                Video
              </div>
              <div
                onClick={() => {
                  setAddPostModal(true);
                }}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <InsertPhotoIcon sx={{ color: "blue" }} />
                Photo
              </div>
              <div
                onClick={() => {
                  setAddPostModal(true);
                }}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <ArticleIcon sx={{ color: "orange" }} />
                Article
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b-1 border-gray-400 w-[100%] my-5" />

        <div className="w-full flex flex-col gap-5">
          {post.map((item, index) => {
            return <Post item={item} key={index} personalData={user} />;
          })}
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

      {addPostModal && (
        <Modal title={""} closeModal={handleModalPost}>
          <AddModal data={user} />
        </Modal>
      )}
    </div>
  );
};

export default Feeds;
