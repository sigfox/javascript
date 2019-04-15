# redux-helpers

Helpers to easily build redux actions, reducers for [@sigfox/redux-api-middleware](https://github.com/sigfox/javascript/tree/master/packages/redux-api-middleware).

## Install

```bash
npm install @sigfox/redux-helpers
```

## Usage - reduxApiFactory

- `type` (`String`) (`mandatory`): This is the type that will be used to generate the actionCreator & reducer types:
  - request: `{type}`
  - success: `{type}_SUCCESS`
  - failure: `{type}_FAILURE`

- `request` (`Function`) (`mandatory`): API call function, it will be used to build the actionCreator.
  
- `resetAtRequest` (`Boolean`) (`default: true`): Do you want the reducer's state to be reset when the request actionCreator is dispatched ?
  
- `transform` (`Function`) (`default: (data) => data`): Function transforming action.payload before it is assigned to the reducer field: `data`.

- `defaultValue` (`any`) (`default: null`): Default value of the reducer field: `data`.

- `dataToRedux` (`Boolean`) (`default: true`): Do you want action.payload to be assigned to the reducer field: `data` ?
  
- `resetOnActions` (`Array[String]`) (`default: []`): List of actions types that will reset the reducer's state.
  
- `reduceOnActions` (`Object`) (`default: {}`): Object containing custom types that you want to reduce on. (see example below)
  
- `reject` (`Boolean`) (`default: false`): Do you want an error to be thrown in the case of an error ?

```javascript
import { combineReducers } from 'redux';
import { reduxApiFactory } from '@sigfox/redux-helpers';

const FETCH_FOO = '@@foo/FETCH_FOO';
const UPDATE_FOO = '@@foo/UPDATE_FOO';

const { actionCreator: getFooAction, reducer: fooReducer } = reduxApiFactory({
  type: FETCH_FOO,
  request: (client, params) => client.get('/foo', params)
});

const { actionCreator: updateFooAction, reducer: updateFooReducer } = reduxApiFactory({
  type: UPDATE_FOO,
  request: (client, params) => client.put('/foo', params),
  dataToRedux: false,
  reduceOnActions: {
    FOOBAR: (state, action) => ({
      ...state,
      loading: false,
      error: action.error
    }),
  }
});

const reducer = combineReducers({
  foo: fooReducer,
  updateFoo: updateFooReducer
});
```

## Usage - getSuccessType & getFailureType

```javascript
import { getSuccessType, getFailureType } from '@sigfox/redux-helpers';

const type = 'FETCH_FOOBAR';

const successType = getSuccessType(type); // FETCH_FOOBAR_SUCCESS
const failureType = getFailureType(type); // FETCH_FOOBAR_FAILURE
```

## Usage - mergeReducers

```javascript
import { mergeReducers } from '@sigfox/redux-helpers';

const todosReducer = (state = { todos: [] }, action) => {
  if (action.type === 'FETCH_TODOS_SUCCESS') {
    return {
      ...state,
      todos: action.data
    }
  }
  return state
}

const stuffReducer = (state = { stuff: [] }, action) => {
  if (action.type === 'FETCH_STUFF_SUCCESS') {
    return {
      ...state,
      stuff: action.data
    }
  }
  return state
}

const mergedReducers = mergeReducers(todosReducer, stuffReducer);
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
