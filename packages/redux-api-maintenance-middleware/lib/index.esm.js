import { API_FAILURE } from '@sigfox/redux-api-middleware';
import isSubset from 'is-subset';

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

var API_MAINTENANCE = '@@redux-api-maintenance-middleware/API_MAINTENANCE';
function reduxApiMaintenanceMiddleware() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    status: 503,
    error: {
      error: 'maintenance'
    }
  };
  return function (_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        if (action.parentType === API_FAILURE && action.status === options.status && isSubset(action.error, options.error)) {
          dispatch({
            type: API_MAINTENANCE,
            status: action.status,
            error: action.error,
            headers: action.headers
          });
          return next(_objectSpread({}, action, {
            maintenance: true
          }));
        }

        next(action);
      };
    };
  };
}

export default reduxApiMaintenanceMiddleware;
export { API_MAINTENANCE };
//# sourceMappingURL=index.esm.js.map
