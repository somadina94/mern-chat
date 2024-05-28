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
    .populate("sender receiver", "name");

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});

exports.getChatList = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Aggregation to get the last message of each conversation
  const chatList = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$sender", userId] },
            then: "$receiver",
            else: "$sender",
          },
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.receiver",
        foreignField: "_id",
        as: "receiverDetails",
      },
    },
    {
      $unwind: {
        path: "$receiverDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "lastMessage.sender",
        foreignField: "_id",
        as: "senderDetails",
      },
    },
    {
      $unwind: {
        path: "$senderDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        receiver: {
          $cond: {
            if: { $eq: ["$lastMessage.receiver", userId] },
            then: {
              id: "$senderDetails._id",
              name: "$senderDetails.name",
              photo: "$senderDetails.photo",
            },
            else: {
              id: "$receiverDetails._id",
              name: "$receiverDetails.name",
              photo: "$receiverDetails.photo",
            },
          },
        },
        lastMessage: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: chatList.length,
    data: {
      chatList,
    },
  });
});
