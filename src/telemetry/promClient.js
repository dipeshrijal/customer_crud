const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Create a custom Histogram metric
const httpRequestDurationMilliseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 300, 500, 1000, 3000],
});

register.registerMetric(httpRequestDurationMilliseconds);

// Middleware to track request duration
function metricsMiddleware(req, res, next) {
  const end = httpRequestDurationMilliseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
  });
  next();
}

// Endpoint to expose metrics
function metricsEndpoint(req, res) {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
}

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
};
