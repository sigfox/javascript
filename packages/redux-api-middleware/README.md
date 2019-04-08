# redux-api-middleware

Redux middleware handling api calls.

## Features

Send api request calling a custom promise.

Depending on the api response, an action will be dispatched containing response data or error.

## Install

```bash
npm install @sigfox/redux-api-middleware
```

## Usage

- Provide a http client to the middleware, this client will be given to you in order to build your request.

- "type: 'api'" is necessary, otherwise, the action will go directly to the next middleware

- "types" must be an array of three elements of format: [request, success, failure], correponding action will be dispatched depending on the status of the api call.

- "reject: true" means that in the case of an error, the error will be thrown

```javascript
const axios = require('axios');
const apiMiddleware = require('@sigfox/redux-api-middleware');

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

// Provide an api client to the middleware
const store = createStore(reducer, applyMiddleware(apiMiddleware(axios.create())));

store.dispatch({
  type: 'api',
  types: ['REQUEST', 'SUCCESS', 'FAILURE'],
  promise: client => client.request({ url: 'http://localhost:3000/data', method: 'get' })
});

// Example using dispatch + getState in the promise.
store.dispatch({
  type: 'api',
  types: ['REQUEST', 'SUCCESS', 'FAILURE'],
  promise: async (client, dispatch, getState) => {
    const state = getState();
    if (!state.isLoading) {
      dispatch({ type: 'START_LOADER' });
    }
    return client.request({ url: 'http://localhost:3000/data', method: 'get' });
  },
  // In the case of an error, this option will throw the error instead of just dispatching an action.
  reject: true
});
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
