import React, { useState, useEffect, useContext } from "react";
import ProfileCard from "../../components/profileCard/ProfileCard";
import Card from "../../components/card/Card";
import Post from "../../components/post/Post";
import Advertisement from "../../components/advertisment/Advertisement";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const SingleActivity = () => {
  const { postId } = useParams();

  const { user } = useContext(AuthContext);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const fetchDataOnLoad = async () => {
      await axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPost/${postId}`)
        .then((res) => {
          setPostData(res?.data?.post);
        })
        .catch((err) => {
          console.log(err);
          alert("Something Went wrong");
        });
    };
    fetchDataOnLoad();
  }, [postId]);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/*Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={user} />
        </div>
      </div>

      {/*Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Post item={postData} personalData={user} />
        </div>
      </div>

      {/*Right side */}
      <div className="w-[26%] py-5 hidden md:block">
        <div className="sticky my-5 top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default SingleActivity;
