const Router = require('koa-router');
const Prometheus = require('prom-client');

module.exports = (options = {}) => {
  const router = new Router();
  const {
    interval: timeout = 10000,
    prefix,
    register = Prometheus.register,
    route = '/metrics'
  } = options;
  Prometheus.collectDefaultMetrics({ prefix, timeout, register, ...options });
  return router
    .get(route, (ctx) => {
      const asJSON = ctx.request.accept.types().includes('application/json');
      ctx.type = register.contentType;
      ctx.body = asJSON ? register.getMetricsAsJSON() : register.metrics();
    })
    .routes();
};
