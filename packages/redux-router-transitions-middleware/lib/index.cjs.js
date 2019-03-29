'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('@sigfox/redux-router/lib/constants');

var locationsAreEqual = function locationsAreEqual(locA, locB) {
  return locA.pathname === locB.pathname && locA.search === locB.search;
};

var getDataDependency = function getDataDependency() {
  var component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var methodName = arguments.length > 1 ? arguments[1] : undefined;
  return (// eslint-disable-line arrow-body-style
    component.WrappedComponent ? getDataDependency(component.WrappedComponent, methodName) : component[methodName]
  );
};

var getDataDependencies = function getDataDependencies(components, getState, dispatch, location, params, deferred) {
  var methodName = deferred ? 'fetchDataDeferred' : 'fetchData';
  var previousPromise = Promise.resolve();
  return components // only look at ones with a static fetchData()
  .filter(function (component) {
    return getDataDependency(component, methodName);
  }) // pull out fetch data methods
  .map(function (component) {
    return getDataDependency(component, methodName);
  }) // call fetch data methods and save promises
  .map(function (fetchData) {
    var promise = fetchData({
      getState: getState,
      dispatch: dispatch,
      location: location,
      params: params,
      previousPromise: previousPromise
    });
    previousPromise = promise;
    return promise;
  });
};

var routerTransitionsMiddleware = function routerTransitionsMiddleware(_ref) {
  var getState = _ref.getState,
      dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      if (action.type === constants.ROUTER_DID_CHANGE) {
        if (getState().router && locationsAreEqual(action.payload.location, getState().router.location)) {
          // if you remove this (because you want to force reloading) you break reconciliation
          // between server-rendered markup and client first render
          // (everything gets re-fetched and re-rendered)
          return next(action);
        }

        var _action$payload = action.payload,
            components = _action$payload.components,
            location = _action$payload.location,
            params = _action$payload.params;
        var promise = new Promise(function (resolve) {
          var doTransition = function doTransition() {
            var promises = getDataDependencies(components, getState, dispatch, location, params, true); // Calling the fetchDataDeferred first allow the REQUEST type ("api")
            // action to be dispatched before the page component is mounted

            next(action);
            Promise.all(promises).then(resolve, resolve);
          };

          Promise.all(getDataDependencies(components, getState, dispatch, location, params)).then(doTransition, doTransition);
        }); // eslint-disable-next-line no-undef

        if (__SERVER__) {
          // router state is null until ReduxRouter is created so we can use this to store
          // our promise to let the server know when it can render
          // eslint-disable-next-line no-param-reassign
          getState().router = promise;
        }

        return promise;
      }

      return next(action);
    };
  };
};

exports.default = routerTransitionsMiddleware;
//# sourceMappingURL=index.cjs.js.map
