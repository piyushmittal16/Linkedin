const NotificationModel = require("../models/notification.js");

// Get all notifications
exports.getNotification = async (req, res) => {
  try {
    let ownId = req.user._id;
    let notification = await NotificationModel.find({ receiver: ownId })
      .sort({ createdAt: -1 })
      .populate("sender receiver");

    return res.status(200).json({
      message: "Notification Fetched Successfully",
      notification: notification,
    });
  } catch (error) {
    console.error("Error in getNotification:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Update Read Notification
exports.updateRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      }
    );

    if (!notification) {
      return res.status(400).json({ error: "Notification not found" });
    }

    return res.status(200).json({
      message: "Read Notification",
    });
  } catch (error) {
    console.error("Error in updateRead:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Active Notification Count
exports.activeNotify = async (req, res) => {
  try {
    let ownId = req.user._id;
    const notification = await NotificationModel.find({
      receiver: ownId,
      isRead: false,
    });

    return res.status(200).json({
      message: "Notification number Fetched Successfully",
      count: notification.length,
    });
  } catch (error) {
    console.error("Error in activeNotify:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
