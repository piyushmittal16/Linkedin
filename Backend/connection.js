const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      console.error(
        "❌ MONGODB_URI is undefined! Please add MONGODB_URI in your Render Dashboard -> Environment tab."
      );
      process.exit(1);
    }

    // Remove any accidental leading/trailing whitespace or quotes
    const cleanUri = uri.trim().replace(/^["']|["']$/g, "");

    await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // stop app if not connected
  }
};

connectDB();

module.exports = mongoose;
