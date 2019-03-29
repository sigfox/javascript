const boom = require('boom');
const Koa = require('koa');
const Router = require('koa-router');
const chai = require('chai');
const chaiHttp = require('chai-http');
const koaBoom = require('..');

chai.use(chaiHttp);

const boomRouter = new Router();
boomRouter.post('/boom/:boomMethod', (ctx) => {
  return ctx.boom(boom[ctx.params.boomMethod]());
});
boomRouter.post('/boom/:boomMethod/:message', (ctx) => {
  return ctx.boom(boom[ctx.params.boomMethod](ctx.params.message));
});

const server = new Koa()
  .use(koaBoom())
  .use(boomRouter.routes())
  .listen();

// boomMethod: the method of Boom that is passed to ctx.boom
// boomMessage: it is the message that we expect to find in res.body.message when boom is called without a custom message
// customMessage: it is the custom message passed to boom

const testRoute = ({ boomMethod, boomMessage, customMessage, status, error }) => () => {
  describe('without message', () => {
    it(`returns ${status}`, async () => {
      const res = await chai.request(server).post(`/boom/${boomMethod}`);
      chai.expect(res).to.have.status(status);
      chai.expect(res.body.statusCode).to.equal(status);
      chai.expect(res.body.error).to.equal(error);
      chai.expect(res.body.message).to.equal(boomMessage || error);
    });
  })

  if (customMessage) {
    describe(`with custom message: ${customMessage}`, () => {
      it(`returns ${status}`, async () => {
        const res = await chai.request(server).post(`/boom/${boomMethod}/${customMessage}`);
        chai.expect(res).to.have.status(status);
        chai.expect(res.body.statusCode).to.equal(status);
        chai.expect(res.body.error).to.equal(error);
        chai.expect(res.body.message).to.equal(customMessage);
      });
    })
  }
};

describe('koa-boom: as a middleware', () => {
  after(() => {
    server.close();
  });

  describe('boom.badRequest', testRoute({
    boomMethod: 'badRequest',
    status: 400,
    error: 'Bad Request',
    customMessage: 'Foobar'
  }));

  describe('boom.unauthorized', testRoute({
    boomMethod: 'unauthorized',
    status: 401,
    error: 'Unauthorized',
    customMessage: 'Foobar'
  }));

  describe('boom.forbidden', testRoute({
    boomMethod: 'forbidden',
    status: 403,
    error: 'Forbidden',
    customMessage: 'Foobar'
  }));

  describe('boom.notFound', testRoute({
    boomMethod: 'notFound',
    status: 404,
    error: 'Not Found',
    customMessage: 'Foobar'
  }));

  describe('boom.badImplementation', testRoute({
    boomMethod: 'badImplementation',
    status: 500,
    error: 'Internal Server Error',
    boomMessage: 'An internal server error occurred',
  }));

  describe('boom.badGateway', testRoute({
    boomMethod: 'badGateway',
    status: 502,
    error: 'Bad Gateway',
    customMessage: 'Foobar'
  }));

  describe('boom.serverUnavailable', testRoute({
    boomMethod: 'serverUnavailable',
    status: 503,
    error: 'Service Unavailable',
    customMessage: 'Foobar'
  }));

  describe('boom.gatewayTimeout', testRoute({
    boomMethod: 'gatewayTimeout',
    status: 504,
    error: 'Gateway Time-out',
    customMessage: 'Foobar'
  }));

  describe('boom.teapot', testRoute({
    boomMethod: 'teapot',
    status: 418,
    error: 'I\'m a teapot',
    customMessage: 'test'
  }));
});
