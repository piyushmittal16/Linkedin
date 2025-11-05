const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth.js");
const PostModel = require("../controller/post.controller.js");

router.post("/", Authentication.auth, PostModel.addPost);
router.post("/likeDislike", Authentication.auth, PostModel.likeDislikePost);
router.get("/getAllPosts",  PostModel.getAllPost);
router.get("/getPost/:postId", PostModel.getPostByPostId);
router.get("/getAllPostByUserId/:userId",PostModel.getAllPostOfUser)
router.get("/getTop5posts/:userId", PostModel.getTop5Posts);

module.exports = router;
