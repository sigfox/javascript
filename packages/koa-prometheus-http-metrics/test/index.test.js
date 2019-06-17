const prometheus = require('@sigfox/koa-prometheus');
const Koa = require('koa');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bodyParser = require('koa-bodyparser');
const { after, before, describe, it } = require('mocha');
const Prometheus = require('prom-client');
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
        .use(prometheus({ register }));
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
