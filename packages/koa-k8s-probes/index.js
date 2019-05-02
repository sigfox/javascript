const Router = require('koa-router');

module.exports = ({ readinessProbe, livenessProbe } = {}) => {
  const router = new Router();
  const probeMiddleware = runProbe => async (ctx) => {
    if (runProbe) {
      try {
        await runProbe(ctx);
        ctx.status = 200;
      } catch (err) {
        ctx.status = 503;
      }
    } else {
      ctx.status = 200;
    }
  };
  router
    .get('/liveness', probeMiddleware(livenessProbe))
    .get('/readiness', probeMiddleware(readinessProbe));
  return router.routes();
};
