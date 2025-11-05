const express = require("express");
const router = express.Router();
const ConversationController = require("../controller/conversation.js");
const Authentication = require("../authentication/auth.js");


router.post("/add-conversation", Authentication.auth, ConversationController.addConversation)
router.get(
  "/get-conversation",
  Authentication.auth,
  ConversationController.getConversation
);

module.exports = router;
