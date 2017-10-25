'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = apiClientMiddleware;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function apiClientMiddleware(client) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (action.type !== 'api') {
          return next(action);
        }

        var promise = action.promise,
            types = action.types,
            reject = action.reject,
            rest = _objectWithoutProperties(action, ['promise', 'types', 'reject']);

        var _types = _slicedToArray(types, 3),
            REQUEST = _types[0],
            SUCCESS = _types[1],
            FAILURE = _types[2];

        next(_extends({}, rest, { type: REQUEST }));

        return promise(client, dispatch, getState).then(function (response) {
          dispatch(_extends({}, rest, {
            type: SUCCESS,
            payload: response.data,
            status: response.status,
            headers: response.headers
          }));
          return response;
        }).catch(function (err) {
          if (__DEVELOPMENT__) console.error(err);
          dispatch(_extends({}, rest, {
            type: FAILURE,
            error: err.response ? err.response.data : err,
            status: err.response ? err.response.status : null,
            headers: err.response ? err.response.headers : null
          }));
          if (reject) throw err;
        });
      };
    };
  };
}
module.exports = exports['default'];