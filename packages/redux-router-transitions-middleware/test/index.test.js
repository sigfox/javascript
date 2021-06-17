import chai from 'chai';
import { describe, it } from 'mocha';
import React from 'react';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createHistory from 'history/lib/createMemoryHistory';

import { Route } from '@sigfox/react-router';
import { reduxReactRouter, routerStateReducer, push } from '@sigfox/redux-router';

import transitionsMiddleware from '../src';

global.__SERVER__ = false;

const INIT_COMPONENT = 'INIT_COMPONENT';

class FirstComponent extends React.Component {
  static fetchDataDeferred = ({ dispatch }) =>
    dispatch({
      type: INIT_COMPONENT,
      data: 1
    });

  render = () => <div>First component</div>;
}

class SecondComponent extends React.Component {
  static fetchDataDeferred = ({ dispatch }) =>
    dispatch({
      type: INIT_COMPONENT,
      data: 2
    });

  render = () => <div>Second component</div>;
}
class FetchDataDeferredComponent extends React.Component {
  static fetchDataDeferred = ({ dispatch }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type: INIT_COMPONENT,
          data: 3
        });
        resolve();
      }, 1000);
    });
  }


  render = () => <div>Fetch data deferred component</div>;
}

class FetchDataComponent extends React.Component {
  static fetchData = ({ dispatch }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type: INIT_COMPONENT,
          data: 4
        });
        resolve();
      }, 1000);
    });
  }


  render = () => <div>Fetch data component</div>;
}

const routes = (
  <Route path="/">
    <Route path="first" component={FirstComponent} />
    <Route path="second" component={SecondComponent} />
    <Route path="deferred" component={FetchDataDeferredComponent} />
    <Route path="notdeferred" component={FetchDataComponent} />
  </Route>
);

const componentReducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_COMPONENT:
      return { data: action.data };
    default:
      return state;
  }
};

const reducer = combineReducers({
  router: routerStateReducer,
  component: componentReducer
});

const store = compose(
  reduxReactRouter({
    routes,
    createHistory
  }),
  applyMiddleware(transitionsMiddleware)
)(createStore)(reducer);

const timeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  })
}

const nextTick = () => {
  return new Promise((resolve) => {
    process.nextTick(() => resolve());
  })
}

describe('transitionsMiddleware', () => {
  it('route to /first', async () => {
    store.dispatch(push({ pathname: '/first' }));
    await nextTick();
    chai.expect(store.getState().router.location.pathname).to.equal('/first');
    chai.expect(store.getState().component.data).to.equal(1);
  });

  it('route to /second', async () => {
    store.dispatch(push({ pathname: '/second' }))
    await nextTick();
    chai.expect(store.getState().router.location.pathname).to.equal('/second');
    chai.expect(store.getState().component.data).to.equal(2);
  });

  it('route to /deferred (fetchDataDeferred)', async () => {
    await store.dispatch(push({ pathname: '/deferred' }));
    await nextTick();
    chai.expect(store.getState().router.location.pathname).to.equal('/deferred');
    await timeout(1100);
    chai.expect(store.getState().component.data).to.equal(3);
  });

  it('route to /notdeferred  (fetchData)', async () => {
    await store.dispatch(push({ pathname: '/notdeferred' }));
    await nextTick();
    chai.expect(store.getState().router.location.pathname).to.not.equal('/notdeferred');
    await timeout(1100);
    chai.expect(store.getState().router.location.pathname).to.equal('/notdeferred');
    chai.expect(store.getState().component.data).to.equal(4);
  });
});
