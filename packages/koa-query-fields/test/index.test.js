const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const qs = require('qs');
const chai = require('chai');
chai.use(require('chai-http'));

const queryFields = require('..');

const data = {
  firstname: 'Theodore',
  lastname: 'Roosevelt',
  company: 'Foobar inc.',
  email: 'theodore.roosevelt@mail.com',
  phoneNumber: '+174928389293',
  address: '3 Ferdinand St, New Julian'
};

const FIELDS_1 = ['firstname', 'lastname'];
const FIELDS_2 = ['company', 'email'];
const FIELDS_3 = ['phoneNumber', 'address'];

const parseQuery = async (ctx, next) => {
  if (ctx.query) {
    ctx.query = qs.parse(ctx.query);
  }
  await next();
};

const getRoutes = () => {
  const router = new Router();

  router.get('/user', queryFields, async (ctx) => {
    ctx.body = data;
  });

  router.get('/users', queryFields, async (ctx) => {
    ctx.body = [...new Array(20)].map(() => data);
  });

  return router.routes();
};

const app = new Koa()
  .use(parseQuery)
  .use(getRoutes())
  .callback();

describe('koa-query-fields', () => {
  describe('calling /user', () => {
    describe('without query string', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/user');
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.all.keys([...FIELDS_1, ...FIELDS_2, ...FIELDS_3]);
      });
    });

    describe('with query string', () => {
      it('returns 200', async () => {
        const query = qs.stringify({ fields: FIELDS_1 });
        const res = await chai.request(app).get(`/user?${query}`);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.all.keys(FIELDS_1);
        chai.expect(res.body).to.not.have.any.keys([...FIELDS_2, ...FIELDS_3]);
      });
    });
  });

  describe('calling /users', () => {
    describe('without query string', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/users');
        chai.expect(res).to.have.status(200);
        res.body.forEach((elem) => {
          chai.expect(elem).to.have.all.keys([...FIELDS_1, ...FIELDS_2, ...FIELDS_3]);
        });
      });
    });

    describe('with query string', () => {
      it('returns 200', async () => {
        const query = qs.stringify({ fields: [...FIELDS_1, ...FIELDS_2] });
        const res = await chai.request(app).get(`/users?${query}`);
        chai.expect(res).to.have.status(200);
        res.body.forEach((elem) => {
          chai.expect(elem).to.have.all.keys([...FIELDS_1, ...FIELDS_2]);
          chai.expect(elem).to.not.have.any.keys(FIELDS_3);
        });
      });
    });
  });
});
