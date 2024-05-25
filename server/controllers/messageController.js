const Message = require("../models/messageModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const handleMessage = require("../util/handleMessage");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { senderId, receiverId, content } = req.body;

  if (!receiverId) {
    return next(new AppError("Receiver id is required", 400));
  }

  if (!senderId) {
    return next(new AppError("Sender id is required", 400));
  }

  if (!content) {
    return next(new AppError("Content is required", 400));
  }

  const message = await handleMessage(senderId, receiverId, content);

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { receiverId } = req.params;

  if (!receiverId) {
    return next(new AppError("Receiver id is required", 400));
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id },
    ],
  })
    .sort("createdAt")
    .populate("sender receiver", "username");

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});
