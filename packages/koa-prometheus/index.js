const Router = require('koa-router');
const Prometheus = require('prom-client');

module.exports = (options = {}) => {
  const router = new Router();
  const { interval: timeout = 10000, prefix, url = '/metrics' } = options;
  Prometheus.collectDefaultMetrics({ prefix, timeout });
  return router
    .get(url, (ctx) => {
      const asJSON = ctx.request.accept.types().includes('application/json');
      ctx.type = Prometheus.register.contentType;
      ctx.body = asJSON ? Prometheus.register.getMetricsAsJSON() : Prometheus.register.metrics();
    })
    .routes();
};
