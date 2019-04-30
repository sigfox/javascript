const getFailureType = type => `${type}_FAILURE`;
const getSuccessType = type => `${type}_SUCCESS`;

const mergeReducers = (...reducers) => (data, action) =>
  reducers.reduce((prevData, currentReducer) => currentReducer(prevData, action), data);

const reduxApiFactory = ({
  type,
  request,
  transform = data => data,
  defaultValue = null,
  resetAtRequest = true,
  dataToRedux = true,
  resetOnActions = [],
  reduceOnActions = {},
  reject = false
}) => {
  if (!type) throw new Error('Action type must be defined');
  if (!request || typeof request !== 'function') {
    throw new Error(
      'Action request must be a function (client [, params]) => client.method(endpoint)'
    );
  }

  const types = [type, getSuccessType(type), getFailureType(type)];

  const initialState = {
    loading: false,
    error: null
  };

  if (dataToRedux) initialState.data = defaultValue;

  const actionCreator = (params, actionKeys = {}) => ({
    type: 'api',
    types,
    promise: client => request(client, params),
    reject,
    params,
    ...actionKeys
  });

  const reducers = {
    [types[0]]: state => ({
      ...(resetAtRequest ? initialState : state),
      loading: true,
      error: null
    }),
    [types[1]]: (state, action) => {
      const returnValue = {
        loading: false,
        error: null
      };
      if (dataToRedux) returnValue.data = transform(action.payload);
      return returnValue;
    },
    [types[2]]: (state, action) => ({
      ...state,
      loading: false,
      error: action.error
    }),
    ...reduceOnActions
  };

  const reducer = (state = initialState, action) => {
    if (resetOnActions.indexOf(action.type) !== -1) {
      return initialState;
    }

    if (reducers[action.type]) return reducers[action.type](state, action);
    return state;
  };

  return {
    actionCreator,
    reducer
  };
};

const helper = { getFailureType, getSuccessType, reduxApiFactory };

export { getFailureType, getSuccessType, mergeReducers, reduxApiFactory };
export default helper;
