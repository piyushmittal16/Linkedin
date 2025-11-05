const MessageModel = require("../models/message.js");

exports.sendMessage = async (req, res) => {
  try {
    let { conversation, message, picture } = req.body;
    let senderId = req.user._id;

    let addMessage = new MessageModel({
      sender: senderId,
      conversation,
      message,
      picture,
    });
    await addMessage.save();
    let populatedMessage = await addMessage.populate("sender");
    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

exports.getMessage = async (req, res) => {
  try {
    let { conversationId } = req.params;
    let message = await MessageModel.find({
      conversation: conversationId,
    }).populate("sender");
    return res.status(200).json({
      message: "Fetched Message Successfully",
      message,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
