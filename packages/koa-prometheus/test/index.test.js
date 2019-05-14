const Koa = require('koa');
const chai = require('chai');
const { after, before, describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const prometheus = require('..');

chai.use(chaiHttp);
chai.should();

describe('koa-prometheus', () => {
  let server;

  after(() => {
    server.close();
  });

  describe('with default configuration', () => {
    let app;

    before(() => {
      app = new Koa().use(prometheus());
      server = app.listen();
    });

    it('should mount /metrics route and return metrics', async () => {
      const res = await chai.request(server).get('/metrics');
      res.should.have.status(200);
      res.text.should.match(/\w+\s\d+\s\d+/gm);
    });

    it('should return metrics as JSON', async () => {
      const res = await chai
        .request(server)
        .get('/metrics')
        .set('Accept', 'application/json');
      res.should.have.status(200);
      res.body.length.should.be.above(1);
    });
  });

  describe('with custom configuration', () => {
    let app;

    before(() => {
      app = new Koa().use(prometheus({ prefix: 'custom_prefix_', url: '/prometheus' }));
      server = app.listen();
    });

    it('should mount custom route', async () => {
      const res = await chai.request(server).get('/prometheus');
      res.should.have.status(200);
      res.text.should.match(/\w+\s\d+\s\d+/gm);
    });

    it('should add a prefix to all attributes', async () => {
      const res = await chai
        .request(server)
        .get('/prometheus')
        .set('Accept', 'application/json');
      res.should.have.status(200);
      res.body.every(metric => metric.name.includes('custom_prefix_')).should.equal(true);
    });
  });
});
