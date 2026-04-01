const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.log("MONGODB_URI not found. Starting server without database connection.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
