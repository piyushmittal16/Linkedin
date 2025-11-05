import React, { useState, useEffect, useContext } from "react";
import ProfileCard from "../../components/profileCard/ProfileCard";
import Advertisement from "../../components/advertisment/Advertisement";
import { useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import Post from "../../components/post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Activities = () => {
  const { id } = useParams();
  const [post, setPost] = useState([]);
   const { user } = useContext(AuthContext);
  const fetchDataOnLoad = async () => {
    await axios
      .get(`http://localhost:4000/api/post/getAllPostByUserId/${id}`)
      .then((res) => {
        setPost(res?.data?.posts);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  };

  useEffect(() => {
    fetchDataOnLoad();
  }, []);

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/*Left side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={post[0]?.user} />
        </div>
      </div>

      {/*Middle side */}
      <div className="w-[100%] py-5 sm:w-[50%]">
        <div>
          <Card padding={1}>
            <div className="text-xl">All Activity</div>
            <div className="w-fit cursor-pointer p-2 border-1 rounded-4xl bg-green-800 my-2 text-white font-semibold">
              Posts
            </div>

            <div className="my-2 flex flex-col gap-2">
              {post.map((item, index) => {
                return (
                  <div key={index} className="w-full">
                    <Post item={item} personalData={user} />
                  </div>
                );
              })}
            </div>
          </Card>
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

export default Activities;
