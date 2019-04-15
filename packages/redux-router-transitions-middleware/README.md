# redux-router-transitions-middleware

Redux middleware for [@sigfox/redux-router](https://github.com/sigfox/redux-router) handling API calls during routes transitions

## Features

When the route changes ([@sigfox/redux-router](https://github.com/sigfox/redux-router)), the middleware checks if the React component associated to the new route has static method "fetchDataDeferred" and calls it.

## Install

```bash
npm install @sigfox/redux-router-transitions-middleware
```

## Usage

```javascript
import React from 'react';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createHistory from 'history/lib/createMemoryHistory';

import { Route } from '@sigfox/react-router';
import { reduxReactRouter, routerStateReducer, push } from '@sigfox/redux-router';
import transitionsMiddleware from '@sigfox/redux-router-transitions-middleware';

const INIT_COMPONENT = 'INIT_COMPONENT';

class FirstComponent extends React.Component {
  static fetchDataDeferred = ({ dispatch }) =>
    dispatch({
      type: INIT_COMPONENT,
      data: 1
    });

  render = () => <div>First component</div>;
}

const routes = (
  <Route path="/">
    <Route path="first" component={FirstComponent} />
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

// This will trigger a rerouting to /first, since the component has the method "fetchDataDeferred", the
// action 'INIT_COMPONENT' will be dispatched and the value of data in the component reducer will change.
store.dispatch(push({ pathname: '/first' }));
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
