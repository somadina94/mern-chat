const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Message must have a sender"],
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Message must have a receiver"],
  },
  content: {
    type: String,
    required: [true, "Message content cannot be empty"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
