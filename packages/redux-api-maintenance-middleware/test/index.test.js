import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';
import { after, before, describe, it } from 'mocha';
import chai from 'chai';
import { applyMiddleware, createStore } from 'redux';
import apiMiddleware from '@sigfox/redux-api-middleware';
import apiMaintenanceMiddleware, { API_MAINTENANCE } from '../src';

const reducer = (state = { maintenance: false }, action) => {
  switch (action.type) {
    case API_MAINTENANCE:
      return { ...action, maintenance: true };
    case 'FAILURE':
      return { ...action, maintenance: action.maintenance || false };
    case 'SUCCESS':
      return { ...action, maintenance: false };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware(
    apiMiddleware(axios.create()),
    apiMaintenanceMiddleware({ status: 503, error: { error: 'maintenance' } })
  )
);

const getRoutes = () => {
  const router = new Router();

  router.get('/ok', (ctx) => {
    ctx.status = 200;
  });

  router.get('/not-maintenance', (ctx) => {
    ctx.status = 503;
  });

  router.get('/maintenance', (ctx) => {
    ctx.status = 503;
    ctx.body = { error: 'maintenance' };
  });

  return router.routes();
};

describe('redux-api-maintenance-middleware', () => {
  let server;
  before((done) => {
    const app = new Koa();
    app.use(getRoutes());
    server = app.listen(3000, done);
  });
  after((done) => {
    server.close(done);
  });

  describe('GET /maintenance', () => {
    it('should match maintenance criteria & update the store -> maintenance: true', async () => {
      await store.dispatch({
        type: 'api',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        promise: client =>
          client.request({ url: 'http://localhost:3000/maintenance', method: 'get' })
      });
      const state = store.getState();
      chai.expect(state.status).to.equal(503);
      chai.expect(state.maintenance).to.equal(true);
      chai.expect(state.error).to.deep.equal({ error: 'maintenance' });
    });
  });

  describe('GET /ok', () => {
    it('should not match maintenance criteria & keep the store -> maintenance: false', async () => {
      await store.dispatch({
        type: 'api',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        promise: client => client.request({ url: 'http://localhost:3000/ok', method: 'get' })
      });
      const state = store.getState();
      chai.expect(state.maintenance).to.equal(false);
    });
  });

  describe('GET /not-maintenance', () => {
    it('should not match maintenance criteria & keep the store -> maintenance: false', async () => {
      await store.dispatch({
        type: 'api',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        promise: client =>
          client.request({ url: 'http://localhost:3000/not-maintenance', method: 'get' })
      });
      const state = store.getState();
      chai.expect(state.maintenance).to.equal(false);
    });
  });
});
