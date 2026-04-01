const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || res.statusCode || 500;

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
