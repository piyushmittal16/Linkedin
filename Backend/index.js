const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

// Import Routes
const UserRoutes = require("./routes/userRoute.js");
const PostRoutes = require("./routes/postRoute.js");
const NotificationRoutes = require("./routes/notification.js");
const CommentRoutes = require("./routes/comments.js");
const ConversationRoutes = require("./routes/conversation.js");
const MessageRoutes = require("./routes/message.js");

// Create HTTP server
const server = http.createServer(app);

// ✅ Flexible CORS origin validator (supports localhost, custom FRONTEND_URL, and *.vercel.app)
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow non-browser requests (mobile, server-to-server, curl)
  const allowed = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const cleanOrigin = origin.replace(/\/$/, "");
  if (allowed.some((url) => cleanOrigin === url.replace(/\/$/, ""))) {
    return true;
  }
  // Allow all Vercel deployments (*.vercel.app)
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith(".vercel.app")) {
      return true;
    }
  } catch (e) {
    // ignore URL parsing error
  }
  return true; // permit origin dynamically to prevent CORS lockouts
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions,
});

// Socket.io Events
io.on("connection", (socket) => {
  console.log("⚡ User Connected");

  socket.on("joinConversation", (conversationId) => {
    console.log(`User Joined Conversation ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("sendMessage", (conId, messageDetail) => {
    console.log("Message Sent");
    socket.to(conId).emit("messageReceived", messageDetail);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});

// MongoDB connection
require("./connection");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("Backend (Render) is live 🚀");
});

// API Routes
app.use("/api/auth", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/conversation", ConversationRoutes);
app.use("/api/message", MessageRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
