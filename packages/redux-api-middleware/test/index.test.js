import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';
import { after, describe, it } from 'mocha';
import chai from 'chai';
import { applyMiddleware, createStore } from 'redux';

import apiMiddleware from '../src';

const getRoutes = () => {
  const router = new Router();

  router.get('/ok', (ctx) => {
    ctx.status = 200;
  });

  router.get('/error', (ctx) => {
    ctx.status = 500;
  });

  return router.routes();
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return action;
    case 'FAILURE':
      return action;
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(apiMiddleware(axios.create())));

const server = new Koa().use(getRoutes()).listen(3000);

describe('redux-api-middleware', () => {
  after(() => {
    server.close();
  });

  describe('GET /ok', () => {
    it('should respond 200 & update the store -> success: true', async () => {
      const res = await store.dispatch({
        type: 'api',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        promise: client => client.request({ url: 'http://localhost:3000/ok', method: 'get' })
      });
      chai.expect(res.status).to.eql(200);
      const state = store.getState();
      chai.expect(state.type).to.eql('SUCCESS');
      chai.expect(state.payload).to.eql('OK');
      chai.expect(state.status).to.eql(200);
    });
  });

  describe('GET /error', () => {
    it('should respond 200 & update the store -> failure: true', async () => {
      await store.dispatch({
        type: 'api',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        promise: client => client.request({ url: 'http://localhost:3000/error', method: 'get' })
      });
      const state = store.getState();
      chai.expect(state.type).to.eql('FAILURE');
      chai.expect(state.error).to.eql('Internal Server Error');
      chai.expect(state.status).to.eql(500);
    });
  });
});
