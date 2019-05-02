const Koa = require('koa');
const chai = require('chai');
const { after, before, describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const k8sProbes = require('..');

chai.use(chaiHttp);
chai.should();

describe('koa-k8s-probes', () => {
  let server;

  after(() => {
    server.close();
  });

  describe('with default configuration', () => {
    let app;

    before(() => {
      app = new Koa().use(k8sProbes());
      server = app.listen();
    });

    it('should mount /liveness route and always return 200', async () => {
      const res = await chai.request(server).get('/liveness');
      res.should.have.status(200);
    });

    it('should mount /readiness route and always return 200', async () => {
      const res = await chai.request(server).get('/readiness');
      res.should.have.status(200);
    });
  });

  describe('with custom configuration', () => {
    let app;

    before(() => {
      app = new Koa().use(
        k8sProbes({
          livenessProbe: ctx => (ctx.query.ok ? Promise.resolve() : Promise.reject()),
          readinessProbe: ctx => (ctx.query.ok ? Promise.resolve() : Promise.reject())
        })
      );
      server = app.listen();
    });

    describe('when probe returns a resolved promise', () => {
      it('should mount /liveness route and return 200', async () => {
        const res = await chai.request(server).get('/liveness?ok=true');
        res.should.have.status(200);
      });

      it('should mount /readiness route and return 200', async () => {
        const res = await chai.request(server).get('/readiness?ok=true');
        res.should.have.status(200);
      });
    });

    describe('when probe returns a rejected promise', () => {
      it('should mount /liveness route and return 503', async () => {
        const res = await chai.request(server).get('/liveness');
        res.should.have.status(503);
      });

      it('should mount /readiness route and return 503', async () => {
        const res = await chai.request(server).get('/readiness');
        res.should.have.status(503);
      });
    });
  });
});
