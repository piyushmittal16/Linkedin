const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

// Different Routes Location
const UserRoutes = require("./routes/userRoute.js");
const PostRoutes = require("./routes/postRoute.js");
const NotificationRoutes = require("./routes/notification.js");
const CommentRoutes = require("./routes/comments.js");
const ConversationRoutes = require("./routes/conversation.js");
const MessageRoutes = require("./routes/message.js");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["Get", "Post"],
  },
});

io.on("connection", (socket) => {
  // console.log("User Connected");
  socket.on("joinConversation", (conversationId) => {
    console.log(`User Joined Conversation ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("sendMessage", (conId, messageDetail) => {
    console.log("Message Sent");
    socket.to(conId).emit("messageReceived", messageDetail);
  });
});

require("./connection");

const Port = process.env.PORT || 4000;

//Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/auth", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/conversation", ConversationRoutes);
app.use("/api/message", MessageRoutes);

server.listen(Port, () => {
  console.log("Backend Start at 4000");
});
