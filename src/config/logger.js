const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, json, printf } = format;
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

const redactSensitiveInfoObject = (message) => {
  const obj = _.cloneDeep(message);
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = redactSensitiveInfoString(obj[key]);
    } else if (typeof obj[key] === "object") {
      obj[key] = redactSensitiveInfoObject(obj[key]);
    }
  }
  return obj;
};

const redactSensitiveInfo = printf(({ level, message, timestamp, ...meta }) => {
  let logObject;

  if (typeof message === "object") {
    logObject = redactSensitiveInfoObject({ timestamp, level, ...message });
  } else {
    logObject = redactSensitiveInfoObject({ timestamp, level, message });
  }

  // Merge any additional metadata into the log object
  logObject = { ...logObject, ...redactSensitiveInfoObject(meta) };

  return JSON.stringify(logObject);
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    redactSensitiveInfo
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
