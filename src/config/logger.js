const winston = require("winston");
const { format, transports } = winston;
const redactSensitiveData = require("../utils/redact");

const redactionFormat = format((info) => {
  // Apply redaction to the message and any additional properties
  if (info.message) {
    info.message = redactSensitiveData(info.message);
  }
  if (info.stack) {
    info.stack = redactSensitiveData(info.stack);
  }
  if (info.meta) {
    info.meta = redactSensitiveData(info.meta);
  }
  return info;
});

const logger = winston.createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp(),
    redactionFormat(), // Apply the redaction format
    format.json() // Ensure log messages are in JSON format
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        redactionFormat(), // Apply redaction format to console logs
        format.json() // Ensure console logs are in JSON format
      ),
    }),
    new transports.File({
      filename: "combined.log",
      format: format.combine(
        format.timestamp(),
        redactionFormat(), // Apply redaction format to file logs
        format.json() // Ensure file logs are in JSON format
      ),
    }),
    new transports.File({
      filename: "errors.log",
      level: "error",
      format: format.combine(
        format.timestamp(),
        redactionFormat(), // Apply redaction format to error logs
        format.json() // Ensure error logs are in JSON format
      ),
    }),
  ],
});

module.exports = logger;
