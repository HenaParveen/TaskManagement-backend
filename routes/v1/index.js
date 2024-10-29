const express = require("express");
const authRoutes = require("./authRoute");
const taskRoutes = require("./taskRoute");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/task", taskRoutes);

module.exports = router;
