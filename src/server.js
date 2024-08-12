require("elastic-apm-node").start({
  serviceName: "customer_crud",
  serverUrl: "http://localhost:8200",
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

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use("/api", customerRoutes);
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT || "3000", () => {
  logger.info(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
