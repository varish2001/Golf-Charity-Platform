const express = require("express");
const { runDraw } = require("../controllers/drawController");

const router = express.Router();

router.get("/", runDraw);

module.exports = router;
