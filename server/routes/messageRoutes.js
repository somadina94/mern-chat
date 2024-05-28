const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/sendMessage").post(messageController.sendMessage);
router.route("/chat-list").get(messageController.getChatList);
router.route("/getMessages/:receiverId").get(messageController.getMessages);

module.exports = router;
