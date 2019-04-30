import axios from 'axios';
import Koa from 'koa';
import Router from 'koa-router';
import { after, describe, it } from 'mocha';
import chai from 'chai';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import apiMiddleware from '@sigfox/redux-api-middleware';

import { reduxApiFactory } from '../src';

const getRoutes = () => {
  const router = new Router();

  router.get('/foo/:id', (ctx) => {
    const { id } = ctx.params;
    if (id === '1') {
      ctx.status = 200;
      ctx.body = 'foo';
    } else {
      ctx.status = 404;
    }
  });

  return router.routes();
};

const FETCH_FOO = 'FETCH_FOO';

const { actionCreator: getFooAction, reducer: fooReducer } = reduxApiFactory({
  type: FETCH_FOO,
  request: (client, id = 1) => client.get(`http://localhost:3000/foo/${id}`)
});

const reducer = combineReducers({
  foo: fooReducer
});

const store = createStore(reducer, applyMiddleware(apiMiddleware(axios.create())));

const server = new Koa().use(getRoutes()).listen(3000);

describe('redux-api-middleware', () => {
  after(() => {
    server.close();
  });

  describe('GET /foo/1', () => {
    it('should respond 200 & update the store', async () => {
      const res = await store.dispatch(getFooAction());
      chai.expect(res.status).to.eql(200);
      const state = store.getState();
      chai.expect(state.foo.data).to.eql('foo');
      chai.expect(state.foo.loading).to.eql(false);
      chai.expect(state.foo.error).to.eql(null);
    });
  });

  describe('GET /foo/2', () => {
    it('should respond 404 & update the store', async () => {
      await store.dispatch(getFooAction(2));
      const state = store.getState();
      chai.expect(state.foo.data).to.eql(null);
      chai.expect(state.foo.loading).to.eql(false);
      chai.expect(state.foo.error).to.eql('Not Found');
    });
  });
});
