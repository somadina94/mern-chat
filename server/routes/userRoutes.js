const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(authController.protect);

router.get("/getUser/:id", userController.getUserByEmailOrUsername);

module.exports = router;
