# redux-api-maintenance-middleware

Redux middleware to catch maintenance window.

## Features

The middleware checks if the `API_FAILURE` action from '@sigfox/redux-api-middleware' is dispatched with a status and error corresponding to a maintenance window, if such action is dispatched the middleware will dispatch an `API_MAINTENANCE` action.

## Install

```bash
npm install @sigfox/redux-api-maintenance-middleware
```

## Usage

```javascript
import { applyMiddleware, createStore } from 'redux';
import axios from 'axios';
import apiMiddleware from '@sigfox/redux-api-middleware';
import apiMaintenanceMiddleware, {
  API_MAINTENANCE
} from '@sigfox/redux-api-maintenance-middleware';

const initialState = { payload: null, error: null, maintenance: false };
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return { payload: action.payload, maintenance: false, error: null };
    case 'FAILURE':
      return { error: action.error, payload: null, maintenance: action.maintenance };
    case API_MAINTENANCE:
      return { ...state, maintenance: true };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware([
    apiMiddleware(axios.create()),
    apiMaintenanceMiddleware({ status: 503, error: { error: 'maintenance' } })
  ])
);

store.dispatch({
  type: 'api',
  types: ['REQUEST', 'SUCCESS', 'FAILURE'],
  promise: client => client.request({ url: 'http://localhost:3000/data', method: 'get' })
});
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
