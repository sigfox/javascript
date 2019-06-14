const Prometheus = require('prom-client');

let httpRequestDurationMs;

module.exports = (options) => {
  const {
    name = 'http_request_duration_ms',
    help = 'Duration of HTTP requests in ms',
    labelNames = ['route'],
    buckets = [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    register = Prometheus.register
  } = options;
  httpRequestDurationMs = new Prometheus.Histogram({
    name,
    help,
    labelNames,
    buckets,
    registers: [register],
    ...options
  });
  return async (ctx, next) => {
    ctx.state.requestStartTime = Date.now();
    await next();
    const requestduration = Date.now() - ctx.state.requestStartTime;
    httpRequestDurationMs.labels(ctx.path).observe(requestduration);
  };
};
module.exports.httpRequestDurationMs = httpRequestDurationMs;
