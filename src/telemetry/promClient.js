// metrics.js
const promClient = require("prom-client");

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

const metricsMiddleware = (req, res, next) => {
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
};

const metricsEndpointHandler = async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsEndpointHandler,
};
