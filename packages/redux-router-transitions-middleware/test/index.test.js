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

const routes = (
  <Route path="/">
    <Route path="first" component={FirstComponent} />
    <Route path="second" component={SecondComponent} />
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

describe('transitionsMiddleware', () => {
  it('route to /first', async () => {
    await store.dispatch(push({ pathname: '/first' }));
    chai.expect(store.getState().router.location.pathname).to.equal('/first');
    chai.expect(store.getState().component.data).to.equal(1);
  });

  it('route to /second', async () => {
    await store.dispatch(push({ pathname: '/second' }));
    chai.expect(store.getState().router.location.pathname).to.equal('/second');
    chai.expect(store.getState().component.data).to.equal(2);
  });
});
