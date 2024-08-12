const logger = require("../utils/logger"); // Your Winston logger

const errorMiddleware = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const responseMessage = err.isOperational
    ? err.message
    : "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message: responseMessage,
  });
};

module.exports = errorMiddleware;
