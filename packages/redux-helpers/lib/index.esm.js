function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var getFailureType = function getFailureType(type) {
  return "".concat(type, "_FAILURE");
};

var getSuccessType = function getSuccessType(type) {
  return "".concat(type, "_SUCCESS");
};

var mergeReducers = function mergeReducers() {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (data, action) {
    return reducers.reduce(function (prevData, currentReducer) {
      return currentReducer(prevData, action);
    }, data);
  };
};

var reduxApiFactory = function reduxApiFactory(_ref) {
  var _objectSpread2;

  var type = _ref.type,
      request = _ref.request,
      _ref$transform = _ref.transform,
      transform = _ref$transform === void 0 ? function (data) {
    return data;
  } : _ref$transform,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === void 0 ? null : _ref$defaultValue,
      _ref$resetAtRequest = _ref.resetAtRequest,
      resetAtRequest = _ref$resetAtRequest === void 0 ? true : _ref$resetAtRequest,
      _ref$dataToRedux = _ref.dataToRedux,
      dataToRedux = _ref$dataToRedux === void 0 ? true : _ref$dataToRedux,
      _ref$resetOnActions = _ref.resetOnActions,
      resetOnActions = _ref$resetOnActions === void 0 ? [] : _ref$resetOnActions,
      _ref$reduceOnActions = _ref.reduceOnActions,
      reduceOnActions = _ref$reduceOnActions === void 0 ? {} : _ref$reduceOnActions,
      _ref$reject = _ref.reject,
      reject = _ref$reject === void 0 ? false : _ref$reject;
  if (!type) throw new Error('Action type must be defined');

  if (!request || typeof request !== 'function') {
    throw new Error('Action request must be a function (client [, params]) => client.method(endpoint)');
  }

  var types = [type, getSuccessType(type), getFailureType(type)];
  var initialState = {
    loading: false,
    error: null
  };
  if (dataToRedux) initialState.data = defaultValue;

  var actionCreator = function actionCreator(params) {
    var actionKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _objectSpread({
      type: 'api',
      types: types,
      promise: function promise(client) {
        return request(client, params);
      },
      reject: reject,
      params: params
    }, actionKeys);
  };

  var reducers = _objectSpread((_objectSpread2 = {}, _defineProperty(_objectSpread2, types[0], function (state) {
    return _objectSpread({}, resetAtRequest ? initialState : state, {
      loading: true,
      error: null
    });
  }), _defineProperty(_objectSpread2, types[1], function (state, action) {
    var returnValue = {
      loading: false,
      error: null
    };
    if (dataToRedux) returnValue.data = transform(action.payload);
    return returnValue;
  }), _defineProperty(_objectSpread2, types[2], function (state, action) {
    return _objectSpread({}, state, {
      loading: false,
      error: action.error
    });
  }), _objectSpread2), reduceOnActions);

  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (resetOnActions.indexOf(action.type) !== -1) {
      return initialState;
    }

    if (reducers[action.type]) return reducers[action.type](state, action);
    return state;
  };

  return {
    actionCreator: actionCreator,
    reducer: reducer
  };
};

var helper = {
  getFailureType: getFailureType,
  getSuccessType: getSuccessType,
  reduxApiFactory: reduxApiFactory
};

export default helper;
export { getFailureType, getSuccessType, mergeReducers, reduxApiFactory };
//# sourceMappingURL=index.esm.js.map
