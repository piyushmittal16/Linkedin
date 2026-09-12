const express = require("express");
const router = express.Router();
const MessageController = require("../controller/message.controller.js");
const Authentication = require("../authentication/auth.js");

router.post('/', Authentication.auth, MessageController.sendMessage);
router.get("/:conversationId", Authentication.auth, MessageController.getMessage);
router.put("/seen/:conversationId", Authentication.auth, MessageController.markAsSeen);

module.exports = router;
