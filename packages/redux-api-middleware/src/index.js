export default function apiClientMiddleware(client) {
  return ({ dispatch, getState }) => next => (action) => {
    if (action.type !== 'api') {
      return next(action);
    }

    const { promise, types, reject, ...rest } = action;
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });

    return promise(client, dispatch, getState)
      .then((response) => {
        dispatch({
          ...rest,
          type: SUCCESS,
          payload: response.data,
          status: response.status,
          headers: response.headers
        });
        return response;
      })
      .catch((err) => {
        dispatch({
          ...rest,
          type: FAILURE,
          error: err.response ? err.response.data : err,
          status: err.response ? err.response.status : null,
          headers: err.response ? err.response.headers : null
        });
        if (reject) throw err;
      });
  };
}
