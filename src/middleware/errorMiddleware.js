const logger = require("../utils/logger"); // Your Winston logger

const errorMiddleware = (err, req, res, next) => {
  // Log the error details
  // logger.error("Unhandled error:", {
  //   message: err.message,
  //   stack: err.stack,
  // });

  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Determine the response status code and message
  const statusCode = err.statusCode || 500;
  const responseMessage = err.isOperational
    ? err.message
    : "Internal Server Error";

  // Respond to the client
  res.status(statusCode).json({
    status: "error",
    message: responseMessage,
  });
};

module.exports = errorMiddleware;
