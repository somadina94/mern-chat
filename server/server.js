const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const app = require("./app");
const Message = require("./models/messageModel");

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("sendMessage", async (senderId, receiverId, content) => {
    try {
    } catch (err) {
      console.log("Error sending message", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

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

const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports.io = io;
