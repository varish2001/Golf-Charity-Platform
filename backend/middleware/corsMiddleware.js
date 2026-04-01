const { allowedOrigins } = require("../config/env");

const corsMiddleware = (req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin || "*");
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
};

module.exports = corsMiddleware;
