const MessageModel = require("../models/message.js");
const ConversationModel = require("../models/conversation.js");
const User = require("../models/user.js");

// Send Message (with connection verification)
exports.sendMessage = async (req, res) => {
  try {
    const { conversation, message, picture } = req.body;
    const senderId = req.user._id;

    if (!conversation) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    // 🔒 Check friendship connection: Disconnected users cannot message each other
    const convo = await ConversationModel.findById(conversation);
    if (!convo) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const otherMemberId = convo.members.find(
      (m) => String(m) !== String(senderId)
    );

    if (otherMemberId) {
      const isConnected = req.user.friends.some(
        (f) => String(f) === String(otherMemberId)
      );
      if (!isConnected) {
        return res.status(403).json({
          error: "You can only message connections. You are disconnected from this user.",
        });
      }
    }

    const addMessage = new MessageModel({
      sender: senderId,
      conversation,
      message,
      picture,
      isSeen: false,
    });
    await addMessage.save();
    const populatedMessage = await addMessage.populate("sender");

    // ⚡ Emit via socket.io to the conversation room and receiver
    if (req.io) {
      req.io.to(String(conversation)).emit("messageReceived", populatedMessage);
      if (otherMemberId) {
        req.io.to(String(otherMemberId)).emit("newConversationMessage", {
          conversationId: conversation,
          message: populatedMessage,
        });
      }
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Get all Messages for a Conversation
exports.getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const message = await MessageModel.find({
      conversation: conversationId,
    })
      .populate("sender")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Fetched Message Successfully",
      message,
    });
  } catch (error) {
    console.error("Error in getMessage:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Mark Messages as Seen
exports.markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;

    await MessageModel.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: currentUserId },
        isSeen: false,
      },
      { $set: { isSeen: true } }
    );

    if (req.io) {
      req.io.to(String(conversationId)).emit("conversationSeen", {
        conversationId,
        readerId: currentUserId,
      });

      const convo = await ConversationModel.findById(conversationId);
      if (convo && convo.members) {
        convo.members.forEach((mId) => {
          if (String(mId) !== String(currentUserId)) {
            req.io.to(String(mId)).emit("conversationSeen", {
              conversationId,
              readerId: currentUserId,
            });
          }
        });
      }
    }

    return res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error in markAsSeen:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
