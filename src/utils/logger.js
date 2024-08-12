const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, json, printf } = format;
const LogstashTransport = require("winston-logstash/lib/winston-logstash-latest");

const _ = require("lodash");
require("dotenv").config();

const redactSensitiveInfoString = (message) => {
  message = message.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[REDACTED EMAIL]"
  );

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

  logObject = { ...logObject, ...redactSensitiveInfoObject(meta) };

  return JSON.stringify(logObject);
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    redactSensitiveInfo
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    // new LogstashTransport({
    //   port: 6001,
    //   node_name: "local",
    //   host: "localhost",
    // }),
  ],
});

module.exports = logger;
