const Koa = require('koa');
const Router = require('koa-router');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const aclMiddleware = require('..');

chai.use(chaiHttp);

const ADMIN_ROLE = 'admin';

const checkAccess = (ctx, next) => {
  ctx.state.user = {};
  ctx.state.roles = [];
  if (ctx.query.isAdmin) {
    ctx.state.user.isAdmin = true;
  }
  if (ctx.query.role === 'admin') {
    ctx.state.user.roles = [ADMIN_ROLE];
    ctx.state.roles = [ADMIN_ROLE];
  }
  return next();
};

const { roles: hasAdminRole, query: isAdmin } = aclMiddleware({
  roles: [ADMIN_ROLE],
  query: ctx => !!(ctx.state.user && ctx.state.user.isAdmin)
});

const controller = (ctx) => {
  ctx.status = 200;
};

const getRoutes = () => {
  const router = new Router();

  router.get('/public', controller);
  router.get('/secret/roles', checkAccess, hasAdminRole, controller);
  router.get('/secret/query', checkAccess, isAdmin, controller);
  router.get('/secret/both', checkAccess, hasAdminRole, isAdmin, controller);

  return router.routes();
};

const app = new Koa().use(getRoutes()).callback();

describe('koa-acl', () => {
  describe('without aclMiddleware', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/public');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('with aclMiddleware using roles', () => {
    describe('without admin access', () => {
      it('returns 403', async () => {
        const res = await chai.request(app).get('/secret/roles');
        chai.expect(res).to.have.status(403);
      });
    });

    describe('with roles containing admin', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/secret/roles?role=admin');
        chai.expect(res).to.have.status(200);
      });
    });
  });

  describe('with aclMiddleware using query', () => {
    describe('without admin access', () => {
      it('returns 403', async () => {
        const res = await chai.request(app).get('/secret/query');
        chai.expect(res).to.have.status(403);
      });
    });

    describe('with isAdmin: true', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/secret/query?isAdmin=true');
        chai.expect(res).to.have.status(200);
      });
    });
  });

  describe('with aclMiddleware using roles & query', () => {
    describe('without admin access', () => {
      it('returns 403', async () => {
        const res = await chai.request(app).get('/secret/both');
        chai.expect(res).to.have.status(403);
      });
    });

    describe('with roles containing admin', () => {
      it('returns 403', async () => {
        const res = await chai.request(app).get('/secret/both?role=admin');
        chai.expect(res).to.have.status(403);
      });
    });

    describe('with isAdmin: true', () => {
      it('returns 403', async () => {
        const res = await chai.request(app).get('/secret/both?isAdmin=true');
        chai.expect(res).to.have.status(403);
      });
    });

    describe('with roles containing admin & isAdmin: true', () => {
      it('returns 200', async () => {
        const res = await chai.request(app).get('/secret/query?role=admin&isAdmin=true');
        chai.expect(res).to.have.status(200);
      });
    });
  });
});
