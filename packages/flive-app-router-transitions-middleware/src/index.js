import { ROUTER_DID_CHANGE } from '@sigfox/redux-router/lib/constants';

const locationsAreEqual = (locA, locB) => (locA.pathname === locB.pathname) && (locA.search === locB.search);

const getDataDependency = (component = {}, methodName) => { // eslint-disable-line arrow-body-style
  return component.WrappedComponent ?
    getDataDependency(component.WrappedComponent, methodName)
    : component[methodName];
};

const getDataDependencies = (components, getState, dispatch, location, params, deferred) => {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';

  let previousPromise = Promise.resolve();
  return components
    // only look at ones with a static fetchData()
    .filter(component => getDataDependency(component, methodName))
    // pull out fetch data methods
    .map(component => getDataDependency(component, methodName))
    // call fetch data methods and save promises
    .map(fetchData => {
      const promise = fetchData({ getState, dispatch, location, params, previousPromise });
      previousPromise = promise;
      return promise;
    });
};


export default ({ getState, dispatch }) => next => (action) => {
  if (action.type === ROUTER_DID_CHANGE) {
    if (getState().router && locationsAreEqual(action.payload.location, getState().router.location)) {
      // if you remove this (because you want to force reloading) you break reconciliation
      // between server-rendered markup and client first render (everything gets re-fetched and re-rendered)
      return next(action);
    }

    const { components, location, params } = action.payload;
    const promise = new Promise((resolve) => {
      const doTransition = () => {
        const promises = getDataDependencies(components, getState, dispatch, location, params, true);
        // Calling the fetchDataDeferred first allow the REQUEST type ("api") action to be dispatched
        // before the page component is mounted
        next(action);
        Promise.all(promises)
          .then(resolve, resolve);
      };

      Promise.all(getDataDependencies(components, getState, dispatch, location, params))
        .then(doTransition, doTransition);
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
