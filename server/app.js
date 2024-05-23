const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
