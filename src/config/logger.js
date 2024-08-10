const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, json } = format;
const _ = require("lodash");

const redactSensitiveInfoString = (message) => {
  // Redact email addresses
  message = message.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[REDACTED EMAIL]"
  );

  // Redact phone numbers (This regex covers various formats)
  message = message.replace(
    /(\+\d{1,3}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/g,
    "[REDACTED PHONE]"
  );

  return message;
};

const redactSensitiveInfoObject = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = redactSensitiveInfoString(obj[key]);
    } else if (typeof obj[key] === "object") {
      obj[key] = redactSensitiveInfoObject(obj[key]);
    }
  }
  return obj;
};

const redactSensitiveInfo = format((info) => {
  const message = _.cloneDeep(info);

  for (const key in message) {
    if (typeof message[key] === "string") {
      message[key] = redactSensitiveInfoString(message[key]);
    } else if (typeof message[key] === "object") {
      message[key] = redactSensitiveInfoObject(message[key]);
    }
  }
  return message;
});

const logger = createLogger({
  level: "info",
  format: combine(
    redactSensitiveInfo(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
