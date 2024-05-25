const Message = require("../models/messageModel");
const io = require("../server").io;

const handleMessage = async (senderId, receiverId, content) => {
  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    // Populate sender and receiver
    await message.populate("sender receiver", "username name").execPopulate();

    // Emit the message to sender and receiver
    io.to(senderId).emit("messageReceived", message);
    io.to(receiverId).emit("messageReceived", message);

    return message;
  } catch (err) {
    console.log("Error sending message", err);

    throw err;
  }
};

module.exports = handleMessage;
