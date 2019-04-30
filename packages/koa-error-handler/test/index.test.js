const chai = require('chai');
const chaiHttp = require('chai-http');
const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const errorHandler = require('..');

chai.use(chaiHttp);

const getRoutes = () => {
  const router = new Router();

  router.get('/ok', (ctx) => {
    ctx.status = 200;
  });

  router.get('/bug', () => {
    throw new Error('it bugs');
  });

  return router.routes();
};

const app = new Koa()
  .use(errorHandler())
  .use(getRoutes())
  .callback();

describe('koa-error-handler', () => {
  describe('without bug', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/ok');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('with error thrown', () => {
    it('returns 500', async () => {
      const res = await chai.request(app).get('/bug');
      chai.expect(res).to.have.status(500);
      chai.expect(res.body).to.deep.equal({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      });
    });
  });
});
