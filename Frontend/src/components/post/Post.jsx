import Card from "../card/Card.jsx";
import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import Button from "@mui/material/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Post = ({ profile, item, personalData }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [like, setLike] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(item?.likes?.length || 0);
  const [noOfComments, setNoOfComments] = useState(item?.comments || 0); 
  const [comments, setComments] = useState([]);
  const [commentSection, setCommentSection] = useState(false);
  const [commentText, setCommentText] = useState("");

 
  useEffect(() => {
    if (!item || !personalData?._id) return;

    const userLiked = item.likes?.some(
      (id) => id.toString() === personalData._id.toString()
    );

    setLike(userLiked);
    setNoOfLikes(item.likes?.length || 0);
    setNoOfComments(item.comments || 0);
  }, [item, personalData]);

  // ✅ Handle Like/Dislike
  const handleLikeFunction = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/post/likeDislike",
        { postId: item?._id },
        { withCredentials: true }
      );

      if (like) {
        setNoOfLikes((prev) => prev - 1);
        setLike(false);
      } else {
        setNoOfLikes((prev) => prev + 1);
        setLike(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  const handleCommentBoxOpenClose = async () => {
    const newState = !commentSection;
    setCommentSection(newState);

    if (newState) {
      try {
        const resp = await axios.get(
          `http://localhost:4000/api/comments/${item?._id}`,
          { withCredentials: true }
        );
        setComments(resp.data.comments);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load comments");
      }
    }
  };

  // ✅ Add new comment
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (commentText.trim().length === 0)
      return toast.error("Please enter comment");

    try {
      const res = await axios.post(
        `http://localhost:4000/api/comments`,
        { postId: item?._id, comment: commentText },
        { withCredentials: true }
      );

      toast.success("Comment added successfully!");
      setCommentText("");

      const newComment = res.data.comment;
      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setNoOfComments((prev) => prev + 1); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Copy post URL
  const copyToClipBoard = async () => {
    try {
      let string = `http://localhost:5173/profile/${personalData?._id}/activities/${item?._id}`;
      await navigator.clipboard.writeText(string);
      toast.success("URL copied successfully");
    } catch (error) {
      // console.log(error);
    }
  };

  const desc = item?.desc;

  return (
    <Card padding={0}>
      {/* 🧍 User Info */}
      <Link to={`/profile/${item?.user?._id}`} className="flex gap-3 p-4">
        <div className="w-12 h-12 rounded-full">
          <img
            src={item?.user?.profile_pic}
            alt="profile"
            className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
          />
        </div>
        <div>
          <div className="text-lg font-semibold">{item?.user?.f_name}</div>
          <div className="text-xs text-gray-500">{item?.user?.headline}</div>
        </div>
      </Link>

      {/* 📝 Post Description */}
      <div className="text-md p-4 my-3 whitespace-pre-line flex-grow">
        {seeMore
          ? desc
          : desc?.length > 50
          ? `${desc.slice(0, 50)}...`
          : `${desc}`}
        {desc?.length > 50 && (
          <span
            onClick={() => setSeeMore(!seeMore)}
            className="text-gray-400 cursor-pointer"
          >
            {seeMore ? "See Less" : "See More"}
          </span>
        )}
      </div>

      {/* 🖼️ Post Image */}
      {item?.imageLink && (
        <div className="w-full h-[300px] object-cover">
          <img src={item?.imageLink} className="w-full h-full" alt="post" />
        </div>
      )}

      {/* ❤️ Like & 💬 Comment Counts */}
      <div className="my-2 p-4 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          {like ? (
            <FavoriteIcon sx={{ color: "blue", fontSize: 17 }} />
          ) : (
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 17 }} />
          )}
          <div className="text-sm text-gray-500">
            <span>{noOfLikes} Likes</span>
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <div className="text-sm text-gray-500">
            <span>{noOfComments} Comments</span>
          </div>
        </div>
      </div>

      {/* 🧩 Action Buttons (Like / Comment / Share) */}
      {!profile && (
        <div className="flex p-1">
          {/* Like Button */}
          <div
            className="w-1/3 flex justify-center gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
            onClick={handleLikeFunction}
          >
            {like ? (
              <FavoriteIcon sx={{ color: "blue" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            <span>Like</span>
          </div>

          {/* Comment Button */}
          <div
            className="w-1/3 flex justify-center gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
            onClick={handleCommentBoxOpenClose}
          >
            {commentSection ? <CommentIcon /> : <CommentOutlinedIcon />}
            <span>Comment</span>
          </div>

          {/* Share Button */}
          <div
            className="w-1/3 flex justify-center gap-2 items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={copyToClipBoard}
          >
            <span>Share</span>
          </div>
        </div>
      )}

      {/* 💬 Comment Section */}
      {commentSection && (
        <div className="p-4 w-full">
          {/* Input Box */}
          <div className="flex gap-3 items-center">
            <img
              src={personalData?.profile_pic}
              className="rounded-full w-12 h-12 border-white cursor-pointer"
            />
            <form className="w-full flex gap-2" onSubmit={handleSendComment}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                placeholder="Add a comment..."
                className="w-full border py-3 px-5 rounded-3xl hover:bg-gray-100"
              />
              <button
                type="submit"
                className="cursor-pointer bg-blue-800 text-white rounded-3xl py-1 px-4"
              >
                Send
              </button>
            </form>
          </div>

          {/* Comment List */}
          <div className="w-full p-4">
            {comments.map((comment, index) => (
              <div key={index} className="my-4">
                <Link
                  to={`/profile/${comment?.user?._id}`}
                  className="flex gap-3"
                >
                  <img
                    src={comment?.user?.profile_pic}
                    className="rounded-full w-10 h-10 border-white cursor-pointer"
                  />
                  <div>
                    <div className="text-md">{comment?.user?.f_name}</div>
                    <div className="text-sm text-gray-500">
                      {comment?.user?.headline}
                    </div>
                  </div>
                </Link>
                <div className="px-13 my-2">{comment?.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </Card>
  );
};

export default Post;
