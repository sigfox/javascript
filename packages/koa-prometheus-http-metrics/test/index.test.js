const prometheus = require('@sigfox/koa-prometheus');
const Koa = require('koa');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bodyParser = require('koa-bodyparser');
const { after, before, describe, it } = require('mocha');
const Prometheus = require('prom-client');
const LegacyRouter = require('koa-router');
const Router = require('@koa/router');
const promHttpMetrics = require('..');

chai.use(chaiHttp);
chai.should();

describe('koa-prometheus-http-metrics', () => {
  let app;
  let server;

  describe('when options are provided', () => {
    before(() => {
      const register = new Prometheus.Registry();
      app = new Koa()
        .use(promHttpMetrics({ register }))
        .use(bodyParser())
        .use(prometheus({ register }))
        .use((ctx) => {
          ctx.status = 200;
        });
      server = app.listen();
    });

    after(() => {
      server.close();
    });

    it('should initialize HTTP metrics', async () => {
      const initMetrics = (await chai.request(server).get('/metrics')).text;
      initMetrics.should.not.match(/http_request_duration_ms_bucket/gm);
      const fullMetrics = (await chai.request(server).get('/metrics')).text;
      fullMetrics.should.match(/http_request_duration_ms_bucket/gm);
    });
  });

  describe('when "filter" options is provided', () => {
    before(() => {
      const register = new Prometheus.Registry();
      app = new Koa()
        .use(
          promHttpMetrics({
            register,
            filter: path => !path.includes('foo')
          })
        )
        .use(bodyParser())
        .use(prometheus({ register }))
        .use((ctx) => {
          ctx.status = 200;
        });
      server = app.listen();
    });

    after(() => {
      server.close();
    });

    it('should only observe HTTP metrics matching filter', async () => {
      await chai.request(server).get('/api/bar');
      await chai.request(server).get('/api/bar');
      await chai.request(server).get('/api/foo');
      const metrics = (await chai.request(server).get('/metrics')).text;
      metrics.should.not.match(
        /http_request_duration_ms_bucket{le="50",method="GET",route="\/api\/foo"}/gm
      );
      metrics.should.not.match(
        /http_requests_total{method="GET",handler="\/api\/foo",statuscode="200"} 1/gm
      );
      metrics.should.match(
        /http_request_duration_ms_bucket{le="50",method="GET",route="\/api\/bar"}/gm
      );
      metrics.should.match(
        /http_requests_total{method="GET",handler="\/api\/bar",statuscode="200"} 2/gm
      );
    });
  });

  describe('when using "koa-router" as router', () => {
    before(() => {
      const register = new Prometheus.Registry();
      const router = new LegacyRouter();
      router.get('/api/users/:id', (ctx) => {
        ctx.body = { name: 'Jeremie' };
      });
      router.post('/api/foo', (ctx) => {
        ctx.status = 204;
      });
      app = new Koa()
        .use(
          promHttpMetrics({
            register
          })
        )
        .use(bodyParser())
        .use(prometheus({ register }))
        .use(router.routes())
        .use(router.allowedMethods());
      server = app.listen();
    });

    after(() => {
      server.close();
    });

    it('should observe HTTP metrics using "ctx.path" as label', async () => {
      await chai.request(server).get('/api/users/1');
      await chai.request(server).post('/api/foo');
      const metrics = (await chai.request(server).get('/metrics')).text;
      metrics.should.match(
        /http_request_duration_ms_bucket{le="50",method="POST",route="\/api\/foo"}/gm
      );
      metrics.should.match(
        /http_requests_total{method="POST",handler="\/api\/foo",statuscode="204"} 1/gm
      );
      metrics.should.match(
        /http_request_duration_ms_bucket{le="50",method="GET",route="\/api\/users\/1"}/gm
      );
      metrics.should.match(
        /http_requests_total{method="GET",handler="\/api\/users\/1",statuscode="200"} 1/gm
      );
    });
  });

  describe('when using "@koa/router" as router', () => {
    before(() => {
      const register = new Prometheus.Registry();
      const router = new Router();
      router.post('/api/users/:id', (ctx) => {
        ctx.body = { name: 'Jeremie' };
      });
      router.get('/api/foo', (ctx) => {
        ctx.status = 204;
      });
      app = new Koa()
        .use(
          promHttpMetrics({
            register
          })
        )
        .use(bodyParser())
        .use(prometheus({ register }))
        .use(router.routes())
        .use(router.allowedMethods());
      server = app.listen();
    });

    after(() => {
      server.close();
    });

    it('should observe HTTP metrics using "ctx.routerPath" as label', async () => {
      await chai.request(server).post('/api/users/:id');
      await chai.request(server).get('/api/foo');
      const metrics = (await chai.request(server).get('/metrics')).text;
      metrics.should.match(
        /http_request_duration_ms_bucket{le="50",method="GET",route="\/api\/foo"}/gm
      );
      metrics.should.match(
        /http_requests_total{method="GET",handler="\/api\/foo",statuscode="204"} 1/gm
      );
      metrics.should.match(
        /http_request_duration_ms_bucket{le="50",method="POST",route="\/api\/users\/:id"}/gm
      );
      metrics.should.match(
        /http_requests_total{method="POST",handler="\/api\/users\/:id",statuscode="200"} 1/gm
      );
    });
  });

  describe('when no options are provided', () => {
    before(() => {
      app = new Koa()
        .use(promHttpMetrics())
        .use(bodyParser())
        .use(prometheus());
      server = app.listen();
    });

    after(() => {
      server.close();
    });

    it('should work', async () => {
      const metrics = (await chai.request(server).get('/metrics')).text;
      metrics.should.match(/nodejs_version_info/gm);
    });
  });
});
