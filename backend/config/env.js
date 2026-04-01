require("dotenv").config();

const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  return [...new Set(origins)];
};

module.exports = {
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET || "default_secret_key",
  NODE_ENV: process.env.NODE_ENV || "development",
  USE_LOCAL_STORAGE: process.env.USE_LOCAL_STORAGE !== "false",
  allowedOrigins: getAllowedOrigins(),
};
