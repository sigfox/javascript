# redux-helpers

## reduxApiFactory

### TL;DR

```javascript
import { reduxApiFactory } from 'filve-app-redux-helpers';
import { combineReducers } from 'redux';

const FETCH_FOO = '@@foo/FETCH_FOO';
const UPDATE_FOO = '@@foo/UPDATE_FOO';

const { actionCreator: getFooAction, reducer: fooReducer } = reduxApiFactory({
  type: FETCH_FOO,
  request: (client, params) => client.get('/foo', params)
})

const { actionCreator: updateFooAction, reducer: updateFooReducer } = reduxApiFactory({
  type: UPDATE_FOO,
  request: (client, params) => client.put('/foo', params),
  dataToRedux: false
})

const reducers
```
