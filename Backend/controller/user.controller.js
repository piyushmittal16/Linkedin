const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const NotificationModel = require("../models/notification.js");

const cookieOption = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// controller/user.controller.js for Registration through google

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginThroughGmail = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    let userExist = await User.findOne({ email });

    if (!userExist) {
      //New user Register
      userExist = await User.create({
        googleId: sub,
        email,
        f_name: name,
        profilePic: picture,
      });
    }

    let jwtToken = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("token", jwtToken, cookieOption);
    return res.status(200).json({ userExist: userExist });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// controller/user.controller.js for Registration
exports.register = async (req, res) => {
  try {
    let { email, password, f_name } = req.body;
    isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ error: "Already have an account with this email." });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashPassword, f_name });
    await newUser.save();
    res.status(201).json({
      message: "User Registered Successfully",
      success: "yes",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// controller/user.controller.js for Login

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist && !userExist.password) {
      res.status(400).json({ error: "Please login through Google" });
    }

    if (userExist && (await bcrypt.compare(password, userExist.password))) {
      //Generate Token
      const token = jwt.sign(
        { userId: userExist._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.cookie("token", token, cookieOption);

      return res.json({
        message: "Logged in Successfully",
        success: "yes",
        userExist,
        token,
      });
    } else {
      return res.status(400).json({ error: "Something is wrong..." });
    }
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//User Update Controller

exports.updateUser = async (req, res) => {
  try {
    const { user } = req.body;
    const userExist = await User.findById(req.user._id);
    if (!userExist) {
      return res.status(400).json({ error: "User Does'nt exist" });
    }
    const updateData = await User.findByIdAndUpdate(userExist._id, user);

    const userData = await User.findById(req.user._id);
    res.status(200).json({
      message: "User Updated Successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//Search Others Profile

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(400).json({ error: "User Does'nt exist" });
    }
    return res.status(200).json({
      message: "User Exist",
      user: userExist,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//For Logout user

exports.logout = async (req, res) => {
  try {
    res
      .clearCookie("token", cookieOption)
      .json({ message: "Logout Successfully" });
  } catch (error) {
    console.error("Error in register:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//User Find

exports.findUser = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user?._id || null;

    const users = await User.find({
      $and: [
        currentUserId ? { _id: { $ne: currentUserId } } : {},
        {
          $or: [
            { f_name: { $regex: new RegExp(query, "i") } },
            { email: { $regex: new RegExp(query, "i") } },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Fetched Members Successfully",
      users,
    });
  } catch (error) {
    console.error("Error in findUser:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// Send Friend Request

exports.sendFriendRequest = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver } = req.body; // jisko request bhejni hai

    // ✅ Check receiver existence
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(400).json({ error: "No such user found" });
    }

    req.user.pending_friends = req.user.pending_friends || [];
    receiverUser.pending_friends = receiverUser.pending_friends || [];
    req.user.friends = req.user.friends || [];
    receiverUser.friends = receiverUser.friends || [];

    // ✅ 1. Check already friends
    if (req.user.friends.some((id) => id.equals(receiver))) {
      return res.status(400).json({ error: "Already friends" });
    }

    // ✅ 2. Check if you already sent a request to them
    if (receiverUser.pending_friends.some((id) => id.equals(sender))) {
      return res.status(400).json({ error: "You already sent a request" });
    }

    // ✅ 3. Check if they already sent you a request
    if (req.user.pending_friends.some((id) => id.equals(receiver))) {
      return res.status(400).json({ error: "They already sent you a request" });
    }

    // ✅ If all clear, push sender in receiver's pending list
    receiverUser.pending_friends.push(sender);

    // ✅ Create notification
    const content = `${req.user.f_name} has sent you a friend request`;
    const notification = new NotificationModel({
      sender,
      receiver,
      content,
      type: "friendRequest",
    });

    await notification.save();
    await receiverUser.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

//Accept Friend Request

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body; //jisne request bheji hai
    const ownId = req.user._id;

    // Fetch both users
    const currentUser = await User.findById(ownId);
    const friendData = await User.findById(friendId);

    if (!friendData) {
      return res.status(400).json({ error: "No such user exists" });
    }

    // Ensure pending_friends exists
    currentUser.pending_friends = currentUser.pending_friends || [];

    const index = currentUser.pending_friends.findIndex((id) =>
      id.equals(friendId)
    );

    if (index === -1) {
      return res.status(400).json({ error: "No request from such user" });
    }

    // Remove from pending list
    currentUser.pending_friends.splice(index, 1);

    // Add each other to friends list
    currentUser.friends.push(friendId);
    friendData.friends.push(ownId);

    const content = `${currentUser.f_name} has accepted your friend request`;

    const notification = new NotificationModel({
      sender: ownId,
      receiver: friendId, // ✅ Fixed
      content,
      type: "friendRequest",
    });

    await notification.save();
    await currentUser.save();
    await friendData.save();

    return res.status(200).json({
      message: "You both are connected now.",
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//Get Friend List

exports.getFriendList = async (req, res) => {
  try {
    let friendList = await req.user.populate("friends");
    return res.status(200).json({
      friends: friendList.friends,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

exports.getPendingFriendList = async (req, res) => {
  try {
    let pendingFriendList = await req.user.populate("pending_friends");
    return res.status(200).json({
      pendingFriends: pendingFriendList.pending_friends,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

//Remove Friend

exports.removeFromFriendList = async (req, res) => {
  try {
    const selfId = req.user._id;
    const { friendId } = req.params; // better to take from params

    const friendData = await User.findById(friendId);

    if (!friendData) {
      return res.status(400).json({ message: "No such user exists" });
    }

    // Find friend's id in own friend list
    const index = req.user.friends.findIndex((id) => id.equals(friendId));

    // Find own id in friend's list
    const friendIndex = friendData.friends.findIndex((id) => id.equals(selfId));

    if (index === -1 || friendIndex === -1) {
      return res.status(400).json({ error: "You are not friends" });
    }

    // Remove from both friend lists
    req.user.friends.splice(index, 1);
    friendData.friends.splice(friendIndex, 1);

    // Save changes
    await req.user.save();
    await friendData.save();

    return res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Error in removeFromFriendList:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
