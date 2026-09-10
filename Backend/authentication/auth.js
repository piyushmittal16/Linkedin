const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// ✅ FIXED VERSION
exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "No token, authorization is denied Login again Please",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user; // ✅ FIXED: Attach to request
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    res.status(401).json({ error: "Token is Not Valid,Please login again" });
  }
};
