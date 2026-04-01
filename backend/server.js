const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const appRoutes = require("./routes");
const corsMiddleware = require("./middleware/corsMiddleware");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { PORT, NODE_ENV } = require("./config/env");

dotenv.config();

const app = express();
const frontendPath = path.join(__dirname, "..", "frontend");

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== "production") {
  app.use(express.static(frontendPath));
}

app.use("/", appRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
