const PostModel = require("../models/post.js");

//Add Post Section

exports.addPost = async (req, res) => {
  try {
    const { desc, imageLink } = req.body;
    const userId = req.user._id;

    const addPost = new PostModel({ user: userId, desc, imageLink });
    if (!addPost) {
      return res.status(400).json({ message: "Something Went wrong" });
    }
    await addPost.save();
    res.status(200).json({
      message: "Post successfully",
      post: addPost,
    });
    // console.log("user :", req.user);
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//Likes & Dislikes Section

exports.likeDislikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "No such Post Found" });
    }
    const index = post.likes.findIndex((id) => id.equals(userId));

    if (index !== -1) {
      //User Already Liked the Post, remove like
      post.likes.splice(index, 1);
    } else {
      //User has not Liked the Post ,add like
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({
      message: index !== -1 ? "Post Unlicked" : "Post Liked",
      likes: post.likes,
    });
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// To get All Post

exports.getAllPost = async (req, res) => {
  try {
    //(.sort({createdAt:-1})-get current(latest) post first then all latest post wise ), (.populate-fetching post's user data also)
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");
    res.status(200).json({
      message: "Fetched Data",
      posts: posts,
    });
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// To get Single Post

exports.getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId).populate("user", "-password");

    if (!post) {
      return res.status(400).json({ message: "No Post" });
    }
    return res.status(200).json({
      message: "Fetched Data",
      post: post,
    });
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};


exports.getAllPostOfUser=async (req,res) => {
  try {
    const { userId } = req.params;
    const posts = await PostModel.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "-password");
    return res.status(200).json({
      message: "Fetched Data",
      posts:posts
    })
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

//Get top 5 post

exports.getTop5Posts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await PostModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .limit(5);
    return res.status(200).json({
      message: "Fetched Data",
      posts: posts,
    });
  } catch (error) {
    // console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
