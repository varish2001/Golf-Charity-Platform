const express = require("express");
const { getCharities, selectCharity } = require("../controllers/charityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCharities);
router.post("/select-charity", protect, selectCharity);

module.exports = router;
