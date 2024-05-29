const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

const Database = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupChatRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");
const Message = require("./models/Message");
const User = require("./models/User");

dotenv.config();

Database.getInstance();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use(errorMiddleware);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 6000;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      socket.userId = user._id;
      socket.username = user.username;
      next();
    } catch (error) {
      console.error("Error fetching user:", error);
      next(new Error("Authentication error"));
    }
  });
};

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinSingleChat", async ({ friendId }) => {
    const room = `single_${[socket.userId, friendId].sort().join("_")}`;
    socket.join(room);
    const messages = await Message.find({ roomId: room });
    socket.emit("loadMessages", messages);
  });

  socket.on("joinGroupChat", async ({ groupId }) => {
    const room = `group_${groupId}`;
    console.log("Joining group", room);
    socket.join(room);
    const messages = await Message.find({ roomId: room });
    socket.emit("loadMessages", messages);
  });

  socket.on("sendSingleMessage", async ({ friendId, message }) => {
    const room = `single_${[socket.userId, friendId].sort().join("_")}`;
    const newMessage = new Message({
      roomId: room,
      userId: socket.userId,
      username: socket.username, 
      message,
    });
    await newMessage.save();
    io.to(room).emit("receiveSingleMessage", {
      userId: socket.userId,
      username: socket.username,
      message,
    });
  });

  socket.on("sendGroupMessage", async ({ groupId, message }) => {
    const room = `group_${groupId}`;
    console.log("usr", socket.username);
    console.log("usr", socket.userId);
    const newMessage = new Message({
      roomId: room,
      userId: socket.userId,
      username: socket.username, 
      message,
    });
    await newMessage.save();
    io.to(room).emit("receiveGroupMessage", {
      username: socket.username,
      message,
    }); 
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
