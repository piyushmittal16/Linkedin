const express = require("express");
const router = express.Router();
const CommentsController = require("../controller/comments.controller.js");
const Authentication = require("../authentication/auth.js");

router.post("/", Authentication.auth, CommentsController.commentPost);
router.get("/:postId", CommentsController.getCommentByPostId);

module.exports = router;
