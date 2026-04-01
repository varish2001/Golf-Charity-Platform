const express = require("express");
const { getHome } = require("../controllers/homeController");
const authRoutes = require("./authRoutes");
const scoreRoutes = require("./scoreRoutes");
const drawRoutes = require("./drawRoutes");
const charityRoutes = require("./charityRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.get("/", getHome);
router.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API health check successful",
  });
});
router.use("/api/auth", authRoutes);
router.use("/scores", scoreRoutes);
router.use("/draw", drawRoutes);
router.use("/charities", charityRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
