const Router = require('koa-router');

module.exports = (config = {}) => {
  const { fieldToVerify = 'isShutdown' } = config;
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
