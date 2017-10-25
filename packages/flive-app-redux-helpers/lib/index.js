'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getSuccessType = exports.getSuccessType = function getSuccessType(type) {
  return type + '_SUCCESS';
};
var getFailureType = exports.getFailureType = function getFailureType(type) {
  return type + '_FAILURE';
};

var mergeReducers = exports.mergeReducers = function mergeReducers() {
  for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (data, action) {
    return reducers.reduce(function (prevData, currentReducer) {
      return currentReducer(prevData, action);
    }, data);
  };
};

var reduxApiFactory = exports.reduxApiFactory = function reduxApiFactory(_ref) {
  var _extends2;

  var type = _ref.type,
      request = _ref.request,
      _ref$transform = _ref.transform,
      transform = _ref$transform === undefined ? function (data) {
    return data;
  } : _ref$transform,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === undefined ? null : _ref$defaultValue,
      _ref$resetAtRequest = _ref.resetAtRequest,
      resetAtRequest = _ref$resetAtRequest === undefined ? true : _ref$resetAtRequest,
      _ref$dataToRedux = _ref.dataToRedux,
      dataToRedux = _ref$dataToRedux === undefined ? true : _ref$dataToRedux,
      _ref$resetOnActions = _ref.resetOnActions,
      resetOnActions = _ref$resetOnActions === undefined ? [] : _ref$resetOnActions,
      _ref$reduceOnActions = _ref.reduceOnActions,
      reduceOnActions = _ref$reduceOnActions === undefined ? {} : _ref$reduceOnActions,
      _ref$reject = _ref.reject,
      reject = _ref$reject === undefined ? false : _ref$reject;

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
    return _extends({
      type: 'api',
      types: types,
      promise: function promise(client) {
        return request(client, params);
      },
      reject: reject,
      params: params
    }, actionKeys);
  };

  var reducers = _extends((_extends2 = {}, _defineProperty(_extends2, types[0], function (state) {
    return _extends({}, resetAtRequest ? initialState : state, {
      loading: true,
      error: null
    });
  }), _defineProperty(_extends2, types[1], function (state, action) {
    var returnValue = {
      loading: false,
      error: null
    };
    if (dataToRedux) returnValue.data = transform(action.payload);
    return returnValue;
  }), _defineProperty(_extends2, types[2], function (state, action) {
    return _extends({}, state, {
      loading: false,
      error: action.error
    });
  }), _extends2), reduceOnActions);

  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

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

exports.default = {
  getFailureType: getFailureType,
  getSuccessType: getSuccessType,
  reduxApiFactory: reduxApiFactory
};