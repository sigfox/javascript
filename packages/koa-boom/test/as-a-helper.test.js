const boom = require('boom');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const { boomHelper } = require('..');

chai.use(chaiHttp);

const isValidationError = ctx => !![400, 422].includes(ctx.status);

const boomRouter = new Router();
boomRouter.post('/boom/:boomMethod', ctx =>
  boomHelper(ctx, boom[ctx.params.boomMethod](), isValidationError)
);
boomRouter.post('/boom/:boomMethod/:boomMessage', (ctx) => {
  boomHelper(
    ctx,
    boom[ctx.params.boomMethod](ctx.params.boomMessage, ctx.request.body),
    isValidationError
  );
});

const app = new Koa()
  .use(bodyParser({ enableTypes: ['text', 'json'] }))
  .use(boomRouter.routes())
  .callback();

const testRoute = ({
  boomMethod,
  boomMessage,
  boomData,
  expectedMessage,
  expectedCustomMessage,
  expectedValidation,
  expectedStatus,
  expectedError
}) => () => {
  describe('with standard boom message', () => {
    it(`returns ${expectedStatus}`, async () => {
      const res = await chai.request(app).post(`/boom/${boomMethod}`);
      chai.expect(res).to.have.status(expectedStatus);
      chai.expect(res.body.statusCode).to.equal(expectedStatus);
      chai.expect(res.body.error).to.equal(expectedError);
      chai.expect(res.body.message).to.equal(expectedMessage);
    });
  });
  if (boomMessage) {
    describe(`with boom message: ${boomMessage}`, () => {
      it(`returns ${expectedStatus}`, async () => {
        const res = await chai
          .request(app)
          .post(`/boom/${boomMethod}/${boomMessage}`)
          .type(typeof boomData === 'string' ? 'text' : 'json')
          .send(boomData);
        chai.expect(res).to.have.status(expectedStatus);
        chai.expect(res.body.statusCode).to.equal(expectedStatus);
        chai.expect(res.body.error).to.equal(expectedError);
        chai.expect(res.body.message).to.equal(expectedCustomMessage);
      });
    });
  }
  if (boomData) {
    describe(`with boom data: ${Array.isArray(boomData) ? 'array' : typeof boomData}`, () => {
      it(`returns ${expectedStatus}`, async () => {
        const res = await chai
          .request(app)
          .post(`/boom/${boomMethod}/${boomMessage}`)
          .type(typeof boomData === 'string' ? 'text' : 'json')
          .send(boomData);
        chai.expect(res).to.have.status(expectedStatus);
        chai.expect(res.body.statusCode).to.equal(expectedStatus);
        chai.expect(res.body.error).to.equal(expectedError);
        chai.expect(res.body.message).to.equal(expectedCustomMessage);
        chai.expect(res.body.validation).to.deep.equal(expectedValidation);
      });
    });
  }
};

describe('koa-boom: as a middleware', () => {
  describe(
    'boom.badRequest',
    testRoute({
      boomMethod: 'badRequest',
      expectedStatus: 400,
      expectedError: 'Bad Request',
      expectedMessage: 'Bad Request',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.badRequest (with data as "string" for validation details)',
    testRoute({
      boomMethod: 'badRequest',
      boomMessage: 'country does not exist',
      boomData: 'address.country',
      expectedStatus: 400,
      expectedError: 'Bad Request',
      expectedMessage: 'Bad Request',
      expectedCustomMessage: 'country does not exist',
      expectedValidation: [
        {
          message: 'country does not exist',
          path: 'address.country',
          type: 'custom',
          context: { key: 'country' }
        }
      ]
    })
  );

  describe(
    'boom.badData (with data as "string" for validation details)',
    testRoute({
      boomMethod: 'badData',
      boomMessage: 'country does not exist',
      boomData: 'address.country',
      expectedStatus: 422,
      expectedError: 'Unprocessable Entity',
      expectedMessage: 'Unprocessable Entity',
      expectedCustomMessage: 'country does not exist',
      expectedValidation: [
        {
          message: 'country does not exist',
          path: 'address.country',
          type: 'custom',
          context: { key: 'country' }
        }
      ]
    })
  );

  describe(
    'boom.badRequest (with data as "object" for validation details)',
    testRoute({
      boomMethod: 'badRequest',
      boomMessage: 'country does not exist',
      boomData: {
        field: 'address.country',
        type: 'invalid-country',
        value: 'Pleurote'
      },
      expectedStatus: 400,
      expectedError: 'Bad Request',
      expectedMessage: 'Bad Request',
      expectedCustomMessage: 'country does not exist',
      expectedValidation: [
        {
          message: 'country does not exist',
          path: 'address.country',
          type: 'invalid-country',
          context: { key: 'country', value: 'Pleurote' }
        }
      ]
    })
  );

  describe(
    'boom.badRequest (with data as "array" for validation details)',
    testRoute({
      boomMethod: 'badRequest',
      boomMessage: 'country does not exist',
      boomData: [
        {
          message: 'country does not exist',
          path: 'address.country',
          type: 'invalid-country',
          context: { key: 'country', value: 'Pleurote' }
        }
      ],
      expectedStatus: 400,
      expectedError: 'Bad Request',
      expectedMessage: 'Bad Request',
      expectedCustomMessage: 'country does not exist',
      expectedValidation: [
        {
          message: 'country does not exist',
          path: 'address.country',
          type: 'invalid-country',
          context: { key: 'country', value: 'Pleurote' }
        }
      ]
    })
  );

  describe(
    'boom.unauthorized',
    testRoute({
      boomMethod: 'unauthorized',
      expectedStatus: 401,
      expectedError: 'Unauthorized',
      expectedMessage: 'Unauthorized',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.forbidden',
    testRoute({
      boomMethod: 'forbidden',
      expectedStatus: 403,
      expectedError: 'Forbidden',
      expectedMessage: 'Forbidden',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.notFound',
    testRoute({
      boomMethod: 'notFound',
      expectedStatus: 404,
      expectedError: 'Not Found',
      expectedMessage: 'Not Found',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.badImplementation',
    testRoute({
      boomMethod: 'badImplementation',
      expectedStatus: 500,
      expectedError: 'Internal Server Error',
      expectedMessage: 'An internal server error occurred',
      boomMessage: 'Foobar',
      // unlike other method boom message does not override message in the returned payload
      expectedCustomMessage: 'An internal server error occurred'
    })
  );

  describe(
    'boom.badGateway',
    testRoute({
      boomMethod: 'badGateway',
      expectedStatus: 502,
      expectedError: 'Bad Gateway',
      expectedMessage: 'Bad Gateway',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.serverUnavailable',
    testRoute({
      boomMethod: 'serverUnavailable',
      expectedStatus: 503,
      expectedError: 'Service Unavailable',
      expectedMessage: 'Service Unavailable',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.gatewayTimeout',
    testRoute({
      boomMethod: 'gatewayTimeout',
      expectedStatus: 504,
      expectedError: 'Gateway Time-out',
      expectedMessage: 'Gateway Time-out',
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );

  describe(
    'boom.teapot',
    testRoute({
      boomMethod: 'teapot',
      expectedStatus: 418,
      expectedError: "I'm a teapot",
      expectedMessage: "I'm a teapot",
      boomMessage: 'Foobar',
      expectedCustomMessage: 'Foobar'
    })
  );
});
