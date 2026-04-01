const mongoose = require("mongoose");
const { USE_LOCAL_STORAGE } = require("./env");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log("MONGODB_URI not found. Server will start without MongoDB.");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (!USE_LOCAL_STORAGE) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
