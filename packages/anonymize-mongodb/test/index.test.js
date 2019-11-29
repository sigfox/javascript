import Koa from 'koa';
import Router from 'koa-router';
import { after, describe, it } from 'mocha';
import chai from 'chai';

import ApiClient from '../src';

const client = new ApiClient({
  baseURL: 'http://localhost:3000/api'
});

const getRoutes = () => {
  const router = new Router({ prefix: '/api' });

  ['post', 'get', 'put', 'patch', 'delete', 'head', 'options'].forEach((method) => {
    router[method]('/data', async (ctx) => {
      ctx.status = 200;
    });
  });

  return router.routes();
};

const server = new Koa().use(getRoutes()).listen(3000);

describe('koa-query-fields', () => {
  after(() => {
    server.close();
  });

  describe('POST /data', () => {
    it('returns 200', async () => {
      const res = await client.post('/data', { lifePurpose: 42 });
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('post');
      chai.expect(res.config.lifePurpose).to.eql(42);
    });
  });

  describe('GET /data', () => {
    it('returns 200', async () => {
      const res = await client.get('/data');
      chai.expect(res.config.method).to.eql('get');
      chai.expect(res.status).to.eql(200);
    });
  });

  describe('PUT /data', () => {
    it('returns 200', async () => {
      const res = await client.put('/data', { lifePurpose: 42 });
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('put');
      chai.expect(res.config.lifePurpose).to.eql(42);
    });
  });

  describe('PATCH /data', () => {
    it('returns 200', async () => {
      const res = await client.patch('/data', { lifePurpose: 42 });
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('patch');
      chai.expect(res.config.lifePurpose).to.eql(42);
    });
  });

  describe('DELETE /data', () => {
    it('returns 200', async () => {
      const res = await client.delete('/data', { lifePurpose: 42 });
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('delete');
      chai.expect(res.config.lifePurpose).to.eql(42);
    });
  });

  describe('HEAD /data', () => {
    it('returns 200', async () => {
      const res = await client.head('/data');
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('head');
    });
  });

  describe('OPTIONS /data', () => {
    it('returns 200', async () => {
      const res = await client.options('/data');
      chai.expect(res.status).to.eql(200);
      chai.expect(res.config.method).to.eql('options');
    });
  });
});
