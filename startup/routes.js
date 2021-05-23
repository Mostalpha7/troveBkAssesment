const express = require("express");
const app = express();

const cors = require("cors");
const { loggerMiddleware } = require("../middlewares/logger");
const { Auth } = require("../middlewares/auth");
const error = require("../middlewares/error");

// Initialize Middlewares
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json({ limit: "100mb", extended: true }));
app.use(loggerMiddleware);

// Route files
const auth = require("../routes/auth.route");
const user = require("../routes/user.route");

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", [Auth], user);

app.use(error);

// Default landing endpoint
app.use("/", (req, res, next) => {
    res.status(200).send({ message: "Welcome to My App" });
});

module.exports = app;