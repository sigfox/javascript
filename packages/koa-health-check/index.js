const Router = require('koa-router');

module.exports = (fieldToVerify = 'isShutdown') => {
  const router = new Router();
  router.get('/health', (ctx) => {
    if (ctx[fieldToVerify]) {
      ctx.status = 503;
    } else {
      ctx.status = 200;
    }
  });
  return router.routes();
};
