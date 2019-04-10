const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));

const multipartForm = require('..');

const getRoutes = () => {
  const router = new Router();

  router.post('/upload', async (ctx) => {
    ctx.status = 200;
  });

  return router.routes();
};

const app = new Koa()
  .use(multipartForm({ maxFileSize: 8 * 1024, maxFieldsSize: 32 }))
  .use(getRoutes())
  .callback();

describe('koa-multipart-form', () => {
  describe('sending small pdf', () => {
    it('returns 200', async () => {
      const res = await chai
        .request(app)
        .post('/upload')
        .attach('files', path.resolve(__dirname, 'sample-files/sample.pdf'), 'sample.pdf');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('sending bigger pdf', () => {
    it('returns 500 because file is too big', async () => {
      const res = await chai
        .request(app)
        .post('/upload')
        .attach('files', path.resolve(__dirname, 'sample-files/big.pdf'), 'big.pdf');
      chai.expect(res).to.have.status(500);
    });
  });

  describe('sending small fields', () => {
    it('returns 200', async () => {
      const res = await chai
        .request(app)
        .post('/upload')
        .field('key', 'value');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('sending big fields', () => {
    it('returns 500', async () => {
      const res = await chai
        .request(app)
        .post('/upload')
        .field('key', [...new Array(10)].map(a => 'aaaaaaaa').join());
      chai.expect(res).to.have.status(500);
    });
  });
});
