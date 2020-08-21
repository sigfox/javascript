const Prometheus = require('prom-client');

let httpRequestDurationMs;

module.exports = (options = {}) => {
  const { buckets = [50, 100, 300, 500], register = Prometheus.register } = options;
  const { filter, ...restOptions } = options;
  httpRequestDurationMs = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route'],
    buckets,
    registers: [register],
    ...restOptions
  });
  const httpRequestsTotal = new Prometheus.Counter({
    name: 'http_requests_total',
    help: 'The total number of HTTP requests made',
    labelNames: ['method', 'handler', 'statuscode'],
    registers: [register],
    ...restOptions
  });
  return async (ctx, next) => {
    ctx.state.requestStartTime = Date.now();
    await next();
    const requestDuration = Date.now() - ctx.state.requestStartTime;
    // prefers routerPath over path, routerPath is less specific
    // and is available in @koajs/router@9.1.0
    const path = ctx.routerPath || ctx.path;
    const shouldObserve = filter ? filter(path) : true;
    const { method } = ctx.request;
    const { status } = ctx.response;
    if (shouldObserve) {
      httpRequestDurationMs.labels(method, path).observe(requestDuration);
      httpRequestsTotal.labels(method, path, status).inc();
    }
  };
};
module.exports.httpRequestDurationMs = httpRequestDurationMs;
