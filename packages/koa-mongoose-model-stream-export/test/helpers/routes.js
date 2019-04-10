const Router = require('koa-router');
const mongooseModelStreamExport = require('../..');

const mountExportRoutes = (models) => {
  const router = new Router();

  router.get('/company-schema', mongooseModelStreamExport(models.Company));
  router.get('/user-schema', mongooseModelStreamExport(models.User));

  return router.routes();
};

module.exports.mountExportRoutes = mountExportRoutes;
