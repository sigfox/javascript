const Koa = require('koa');
const chai = require('chai');
const chaiHttp = require('chai-http');
const healthCheck = require('..');

chai.use(chaiHttp);

const app = new Koa()
  .use(healthCheck('customField'));

describe('koa-health-check: with custom field (customField)', () => {
  let server;
  before(() => {
    server = app.listen();
  })

  after(() => {
    server.close();
  })

  describe('without modifying the app.context', () => {
    it('returns 200', async () => {
      const res = await chai.request(server).get('/health');
      chai.expect(res).to.have.status(200);
    });
  })

  describe('with app.context.isShutdown = true', () => {
    it('returns 200', async () => {
      app.context.isShutdown = true;
      const res = await chai.request(server).get('/health');
      delete app.context.isShutdown;
      chai.expect(res).to.have.status(200);
    })
  })

  describe('with app.context.customField = true', () => {
    it('returns 503', async () => {
      app.context.customField = true;
      const res = await chai.request(server).get('/health');
      delete app.context.customField;
      chai.expect(res).to.have.status(503);
    })
  })

  describe('with app.context.customField = false', () => {
    it('returns 200', async () => {
      app.context.customField = false;
      const res = await chai.request(server).get('/health');
      delete app.context.customField;
      chai.expect(res).to.have.status(200);
    })
  })
});

