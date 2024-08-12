require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const mongoURI = process.env.MONGO_URI;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURI, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      logger.info("Connected to MongoDB");
    })
    .catch((err) => {
      logger.error(
        "Failed to connect to MongoDB, retrying in 5 seconds...",
        err
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

module.exports = mongoose.connection;
