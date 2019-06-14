const chai = require('chai');
const { after, before, describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const KoaOps = require('..');

chai.use(chaiHttp);
chai.should();

describe('koa-k8s-ops-app', () => {
  let app;
  let server;

  before(() => {
    const imaTeapot = (ctx) => {
      ctx.body = 'imateapot';
    };
    app = new KoaOps({ probes: { livenessProbe: imaTeapot, readinessProbe: imaTeapot } });
    server = app.listen();
  });

  after(() => {
    server.close();
  });

  it('should create an app with default middlewares', async () => {
    const livenessText = (await chai.request(server).get('/liveness')).text;
    const metricsText = (await chai.request(server).get('/metrics')).text;
    const readinessText = (await chai.request(server).get('/readiness')).text;
    livenessText.should.equal('imateapot');
    metricsText.should.match(/nodejs_version_info/gm);
    readinessText.should.equal('imateapot');
  });
});
