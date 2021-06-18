import { ROUTER_DID_CHANGE } from '@sigfox/redux-router/lib/constants';

const locationsAreEqual = (locA, locB) =>
  locA.pathname === locB.pathname && locA.search === locB.search;

const FETCH_DATA_METHOD = 'fetchData';
const FETCH_DATA_DEFERRED_METHOD = 'fetchDataDeferred';

// Utility to extract the wrapped component and its fetchData/fetchDataDeferred methods
// when imported with @loadable/component
// such as:
// ```
// const AsyncComponent = loadable(() =>
//  import(
//   /* webpackChunkName: "AsyncComponent", webpackPrefetch: true */ './pages/AsyncComponent'
//  )
// );
// ```
// AsyncComponent has a `load` method to trigger loading of the JS chunk and get the
// underlying React Component
// This method is triggered only during Client Side Rendering not on
// Server Side Rendering, no changes is required here to support @loadable during SSR.
// To setup SSR with @loadable see https://loadable-components.com/docs/server-side-rendering/
const getLoadableDataDependency = (LoadableComponent, methodName) => (fetchDataOptions) => {
  if (methodName === FETCH_DATA_DEFERRED_METHOD) {
    return LoadableComponent.load().then((Component) => {
      // eslint-disable-next-line no-use-before-define
      const fetchData = getDataDependency(Component.default, FETCH_DATA_METHOD);
      if (fetchData && !LoadableComponent.enableFetchData) {
        console.warn(`Warning: Component "${Component.default.displayName}" is wrapped by @loadable/component and has a ${FETCH_DATA_METHOD} method,
  ${FETCH_DATA_METHOD} method is NOT called by @sigfox/redux-router-transitions-middleware on a Loadable component
  if the Loadable component has no property "enableFetchData" set to true.`);
      }
      // eslint-disable-next-line no-use-before-define
      const fetchDataDeferred = getDataDependency(
        Component.default,
        FETCH_DATA_DEFERRED_METHOD
      );
      if (fetchDataDeferred) return fetchDataDeferred(fetchDataOptions);
    });
  }
  if (methodName === FETCH_DATA_METHOD && LoadableComponent.enableFetchData) {
    return LoadableComponent.load().then((Component) => {
      // eslint-disable-next-line no-use-before-define
      const fetchData = getDataDependency(Component.default, FETCH_DATA_METHOD);
      if (fetchData) return fetchData(fetchDataOptions);
    });
  }
}

const getDataDependency = function getDataDependency(component = {}, methodName) {
  if (component[methodName]) return component[methodName];
  if (component.WrappedComponent) {
    return getDataDependency(component.WrappedComponent, methodName);
  }
  // Look for the `load` method available on @loadable/component during Client Side Rendering
  if (component.load) {
    return getLoadableDataDependency(component, methodName);
  }
  return undefined;
};

const getDataDependencies = (components, getState, dispatch, location, params, deferred) => {
  const methodName = deferred ? FETCH_DATA_DEFERRED_METHOD : FETCH_DATA_METHOD;

  let previousPromise = Promise.resolve();
  return (
    components
      // only look at ones with a static fetchData()
      .filter(component => getDataDependency(component, methodName))
      // pull out fetch data methods
      .map(component => getDataDependency(component, methodName))
      // call fetch data methods and save promises
      .map((fetchData) => {
        const promise = fetchData({ getState, dispatch, location, params, previousPromise });
        previousPromise = promise;
        return promise;
      })
  );
};

const routerTransitionsMiddleware = ({ getState, dispatch }) => next => (action) => {
  if (action.type === ROUTER_DID_CHANGE) {
    if (
      getState().router
      && locationsAreEqual(action.payload.location, getState().router.location)
    ) {
      // if you remove this (because you want to force reloading) you break reconciliation
      // between server-rendered markup and client first render
      // (everything gets re-fetched and re-rendered)
      return next(action);
    }

    const { components, location, params } = action.payload;
    const promise = new Promise((resolve) => {
      const doTransition = () => {
        const promises = getDataDependencies(
          components,
          getState,
          dispatch,
          location,
          params,
          true
        );
        // Calling the fetchDataDeferred first allow the REQUEST type ("api")
        // action to be dispatched before the page component is mounted
        next(action);
        Promise.all(promises).then(resolve, resolve);
      };

      Promise.all(getDataDependencies(components, getState, dispatch, location, params, false))
        .then(
          doTransition,
          doTransition
        );
    });

    // eslint-disable-next-line no-undef
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

export default routerTransitionsMiddleware;
