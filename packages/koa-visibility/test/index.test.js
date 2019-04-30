const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));

const visibility = require('..');

const PUBLIC_FIELDS = ['firstname', 'lastname'];
const USER_FIELDS = ['company', 'email'];
const ADMIN_FIELDS = ['phoneNumber', 'address'];

const setUser = (ctx, next) => {
  ctx.state.user = {};
  if (ctx.query.role === 'user') {
    ctx.state.user.roles = ['user'];
  }
  if (ctx.query.role === 'admin') {
    ctx.state.user.roles = ['user', 'admin'];
  }
  return next();
};

const visibilityMiddleware = visibility({
  public: PUBLIC_FIELDS,
  user: [...PUBLIC_FIELDS, ...USER_FIELDS],
  admin: [...PUBLIC_FIELDS, ...USER_FIELDS, ...ADMIN_FIELDS]
});

const data = {
  firstname: 'Theodore',
  lastname: 'Roosevelt',
  company: 'Foobar inc.',
  email: 'theodore.roosevelt@mail.com',
  phoneNumber: '+174928389293',
  address: '3 Ferdinand St, New Julian'
};

const getRoutes = () => {
  const router = new Router();

  router.get('/user', setUser, visibilityMiddleware, async (ctx) => {
    ctx.body = data;
  });

  router.get('/users', setUser, visibilityMiddleware, async (ctx) => {
    ctx.body = [...new Array(20)].map(() => data);
  });

  return router.routes();
};

const app = new Koa().use(getRoutes()).callback();

describe('koa-visibility', () => {
  describe('as a visitor', () => {
    describe('calling /user', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/user');
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.all.keys(PUBLIC_FIELDS);
        chai.expect(res.body).to.not.have.any.keys([...USER_FIELDS, ...ADMIN_FIELDS]);
      });
    });

    describe('calling /users', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/users');
        chai.expect(res).to.have.status(200);
        res.body.forEach((elem) => {
          chai.expect(elem).to.have.all.keys(PUBLIC_FIELDS);
          chai.expect(elem).to.not.have.any.keys([...USER_FIELDS, ...ADMIN_FIELDS]);
        });
      });
    });
  });

  describe('as an user', () => {
    describe('calling /user', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/user?role=user');
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.all.keys([...PUBLIC_FIELDS, ...USER_FIELDS]);
        chai.expect(res.body).to.not.have.any.keys(ADMIN_FIELDS);
      });
    });

    describe('calling /users', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/users?role=user');
        chai.expect(res).to.have.status(200);
        res.body.forEach((elem) => {
          chai.expect(elem).to.have.all.keys([...PUBLIC_FIELDS, ...USER_FIELDS]);
          chai.expect(elem).to.not.have.any.keys(ADMIN_FIELDS);
        });
      });
    });
  });

  describe('as an admin', () => {
    describe('calling /user', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/user?role=admin');
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.all.keys([...PUBLIC_FIELDS, ...USER_FIELDS, ...ADMIN_FIELDS]);
      });
    });

    describe('calling /users', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/users?role=admin');
        chai.expect(res).to.have.status(200);
        res.body.forEach((elem) => {
          chai.expect(elem).to.have.all.keys([...PUBLIC_FIELDS, ...USER_FIELDS, ...ADMIN_FIELDS]);
        });
      });
    });
  });
});
