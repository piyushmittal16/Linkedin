const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// ✅ FIXED VERSION
exports.auth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also check Authorization header: Bearer <token>
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        error: "No token, authorization is denied. Please login again",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user; // Attach to request
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    res.status(401).json({ error: "Token is not valid, please login again" });
  }
};
