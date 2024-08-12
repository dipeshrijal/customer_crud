require("elastic-apm-node").start({
  serviceName: "customer_crud",
  secretToken: "ySuS71oPlsLzuDn74F",
  serverUrl:
    "https://437d792d87804c9a8d1d2998e51bef07.apm.us-central1.gcp.cloud.es.io:443",
  environment: "development",
  captureBody: "errors", // Redact request bodies unless capturing for error events
  captureHeaders: false, // Disable capturing headers to avoid sending sensitive info
});

require("./telemetry/otel");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const helmet = require("helmet");
const logger = require("./utils/logger");
require("./config/db"); // Ensure database connection is established
const promClient = require("prom-client");
const app = express();

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const requestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
});

const requestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Histogram of HTTP request duration",
  labelNames: ["method", "route"],
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Middleware to track metrics
app.use((req, res, next) => {
  const end = requestDuration.startTimer();
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      code: res.statusCode,
    });
    end({ method: req.method, route: req.route ? req.route.path : req.url });
  });
  next();
});

app.use(helmet());
app.use(bodyParser.json());
app.use("/api", customerRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT || "3000", () => {
  logger.info(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
