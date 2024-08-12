const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { trace } = require("@opentelemetry/api");

// Initialize the NodeTracerProvider
// Initialize the NodeTracerProvider with a service name
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "customer_crud", // Replace with your service name
  }),
});

// Configure the exporter (OTLP in this case)
const exporter = new OTLPTraceExporter({
  // URL to the OTLP endpoint (e.g., Jaeger, Zipkin, or an observability backend)
  url: "http://jaeger:4318/v1/traces",
});

// Use SimpleSpanProcessor to send spans immediately
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Register the provider as the global tracer provider
provider.register();

// Register auto-instrumentations for Node.js
registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations()],
});

// Now you can use the global tracer throughout your application
const tracer = trace.getTracer("custoner-crud-tracer");

module.exports = tracer;
