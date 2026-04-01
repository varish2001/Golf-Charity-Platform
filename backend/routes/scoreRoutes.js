const express = require("express");
const { addScore, getScores } = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addScore);
router.get("/", protect, getScores);

module.exports = router;
