const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller.js");
const Authentication = require("../authentication/auth.js");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/google", UserController.loginThroughGmail);

router.put("/update", Authentication.auth, UserController.updateUser);
router.post("/logout", Authentication.auth, UserController.logout);
router.get("/user/:id", UserController.getProfileById);

router.get("/self", Authentication.auth, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

router.get("/findUser", Authentication.auth, UserController.findUser);
router.post(
  "/sendfriendrequest",
  Authentication.auth,
  UserController.sendFriendRequest
);
router.post(
  "/acceptfriendrequest",
  Authentication.auth,
  UserController.acceptFriendRequest
);
router.get("/friendlist", Authentication.auth, UserController.getFriendList);

router.delete(
  "/removefromfriendlist/:friendId",
  Authentication.auth,
  UserController.removeFromFriendList
);

router.get(
  "/pendingfriendlist",
  Authentication.auth,
  UserController.getPendingFriendList
);
module.exports = router;
