require("elastic-apm-node").start({
  serviceName: "customer_crud",
  secretToken: "ySuS71oPlsLzuDn74F",
  serverUrl:
    "https://437d792d87804c9a8d1d2998e51bef07.apm.us-central1.gcp.cloud.es.io:443",
  environment: "development",
  captureBody: "errors",
  captureHeaders: false,
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
require("./config/db");
const app = express();

const {
  metricsMiddleware,
  metricsEndpointHandler,
} = require("./telemetry/promClient");

app.use(metricsMiddleware);
app.use(helmet());
app.use(bodyParser.json());
app.get("/metrics", metricsEndpointHandler);
app.use("/api", customerRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT || "3000", () => {
  logger.info(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
