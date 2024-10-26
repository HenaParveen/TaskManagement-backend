const express = require("express");
const authRoutes = require("./authRoute");
const taskRoutes = require("./taskRoute");

const router = express.Router();

/* 3rd level of routing till v1 keyword */
router.use("/auth", authRoutes);
router.use("/task", taskRoutes);

module.exports = router; //Moduled export
