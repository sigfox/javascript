const http = require('http');
const Koa = require('koa');
const chai = require('chai');
const { before, describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const maintenance = require('..');

chai.use(chaiHttp);

describe('koa-maintenance', () => {
  describe('with isOn default value', () => {
    let server;
    before(() => {
      const app = new Koa();
      app.use(maintenance());
      app.use((ctx) => {
        ctx.status = 200;
      });
      server = http.createServer(app.callback());
    });
    it('returns 200', async () => {
      const res = await chai.request(server).get('/example');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('with isOn set to false', () => {
    let app;
    before(() => {
      app = new Koa();
      app.use(maintenance(false));
      app.use((ctx) => {
        ctx.status = 200;
      });
    });
    it('returns 200', async () => {
      const res = await chai.request(app.callback()).get('/example');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('with isOn set to true', () => {
    let app;
    before(() => {
      app = new Koa();
      app.use(maintenance(true));
      app.use((ctx) => {
        ctx.status = 200;
      });
    });
    it('returns 503 and default body', async () => {
      const res = await chai.request(app.callback()).get('/example');
      chai.expect(res).to.have.status(503);
      chai.expect(res.body.error).to.equal('maintenance');
      chai.expect(res.body.message).to.equal('We are currently down for maintenance.');
    });
  });

  describe('with isOn set to true with options.status set to 500', () => {
    let app;
    before(() => {
      app = new Koa();
      app.use(
        maintenance(true, { status: 500, body: { message: 'Something special is coming...' } })
      );
      app.use((ctx) => {
        ctx.status = 200;
      });
    });
    it('returns 500 and custom body', async () => {
      const res = await chai.request(app.callback()).get('/example');
      chai.expect(res).to.have.status(500);
      chai.expect(res.body.error).to.equal(undefined);
      chai.expect(res.body.message).to.equal('Something special is coming...');
    });
  });
});
