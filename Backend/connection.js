const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Fix DNS querySrv ECONNREFUSED issues on Windows / broadband ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore if restricted
}

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
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // stop app if not connected
  }
};

connectDB();

module.exports = mongoose;
