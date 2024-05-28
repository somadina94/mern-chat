const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const validator = require("validator");

exports.getUserByEmailOrUsername = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Please enter an email or username", 400));
  }

  let user;

  if (validator.isEmail(id)) {
    user = await User.findOne({ email: id });
  } else {
    user = await User.findOne({ username: id });
  }

  if (!user) {
    return next(
      new AppError("User not found with provided email or username", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
