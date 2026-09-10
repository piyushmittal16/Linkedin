const express = require('express')
const router = express.Router()
const Authentication = require('../authentication/auth.js')
const NotificationController = require('../controller/notification.js')



router.get(
  "/",
  Authentication.auth,
  NotificationController.getNotification
);
router.put('/isRead', Authentication.auth, NotificationController.updateRead)
router.get("/activeNotification", Authentication.auth, NotificationController.activeNotify);

module.exports = router;