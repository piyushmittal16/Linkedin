const CommentModel = require("../models/comments.js");
const NotificationModel = require("../models/notification.js");
const PostModel = require("../models/post.js");


exports.commentPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    // Check if post exists
    const postExist = await PostModel.findById(postId).populate("user");
    if (!postExist) {
      return res.status(404).json({ message: "No such post found" });
    }

    // Increment comment count (if post.comments is a number)
    postExist.comments = (postExist.comments || 0) + 1;
    await postExist.save();

    // Create new comment
    const newComment = new CommentModel({
      user: userId,
      post: postId,
      comment,
    });
    await newComment.save();

    // Populate comment with user details (for frontend display)
    const populatedComment = await CommentModel.findById(
      newComment._id
    ).populate("user", "f_name headline profile_pic");

    // Create a notification for post owner
    const notification = new NotificationModel({
      sender: userId,
      receiver: postExist.user._id,
      type: "comment",
      postId: postId.toString(),
      content: `${req.user.f_name} commented on your post.`,
    });
    await notification.save();

    // Send success response
    return res.status(200).json({
      message: "Commented Successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error in commentPost:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

exports.getCommentByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post existence
    const postExist = await PostModel.findById(postId);
    if (!postExist) {
      return res.status(404).json({ message: "No such post found" });
    }

    // Fetch comments and sort latest first
    const comments = await CommentModel.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "f_name headline profile_pic");

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Error in getCommentByPostId:", error);
    return res.status(500).json({
      message: "Server error in comment controller",
      error: error.message,
    });
  }
};
