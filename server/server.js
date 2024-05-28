const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const app = require("./app");
const Message = require("./models/messageModel");
const handleMessage = require("./util/handleMessage");

const server = http.createServer(app);

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  const database = await mongoose.connect(DB);
  if (database.STATES.connected === 1)
    console.log("DB connected successfully!!!");
};

connectDB();

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      // Populate sender and receiver
      await message.populate("sender receiver", "username name");

      // Emit the message to sender and receiver
      io.to(senderId).emit("messageReceived", message);
      io.to(receiverId).emit("messageReceived", message);
    } catch (err) {
      console.log("Error sending message", err.message);
    }
  });

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports.io = io;
