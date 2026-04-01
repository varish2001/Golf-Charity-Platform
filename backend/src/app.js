const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Golf Charity Subscription Platform API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;
