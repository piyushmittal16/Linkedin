const ConversationModel = require("../models/conversation.js");
const MessageModal = require("../models/message.js");

// Add Conversation + Message
exports.addConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, message } = req.body;

    let isConversationExist = await ConversationModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!isConversationExist) {
      let newConversation = new ConversationModel({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      let addMessage = new MessageModal({
        sender: req.user._id,
        conversation: newConversation._id,
        message,
      });
      await addMessage.save();
    } else {
      let addMessage = new MessageModal({
        sender: req.user._id,
        conversation: isConversationExist._id,
        message,
      });
      await addMessage.save();
    }

    return res.status(201).json({
      message: "Message Sent Successfully",
    });
  } catch (error) {
    console.error("Error in addConversation:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// Get Conversation
exports.getConversation = async (req, res) => {
  try {
    const ownId = req.user._id;

    const conversations = await ConversationModel.find({
      members: { $in: [ownId] },
    })
      .populate("members", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetched Successfully",
      conversations,
    });
  } catch (error) {
    console.error("Error in getConversation:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
