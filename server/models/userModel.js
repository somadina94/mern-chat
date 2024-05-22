const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Please choose a username"],
  },
  photo: {
    type: String,
    default: "placeholder",
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: "passwords are not the same",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  userPassword,
  candidatePassword
) {
  return await bcrypt.compare(userPassword, candidatePassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
