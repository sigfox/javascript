const Prometheus = require('prom-client');

let httpRequestDurationMs;

module.exports = (options = {}) => {
  const {
    name = 'http_request_duration_ms',
    help = 'Duration of HTTP requests in ms',
    labelNames = ['route'],
    buckets = [50, 100, 300, 500],
    register = Prometheus.register
  } = options;
  const { filter, ...restOptions } = options;
  httpRequestDurationMs = new Prometheus.Histogram({
    name,
    help,
    labelNames,
    buckets,
    registers: [register],
    ...restOptions
  });
  return async (ctx, next) => {
    ctx.state.requestStartTime = Date.now();
    await next();
    const requestduration = Date.now() - ctx.state.requestStartTime;
    // prefers routerPath over path, routerPath is less specific
    // and is available in @koajs/router@9.1.0
    const path = ctx.routerPath || ctx.path;
    const shouldObserve = filter ? filter(path) : true;
    if (shouldObserve) httpRequestDurationMs.labels(path).observe(requestduration);
  };
};
module.exports.httpRequestDurationMs = httpRequestDurationMs;
