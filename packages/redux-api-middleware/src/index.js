export const API_FAILURE = '@@redux-api-middleware/API_FAILURE';
export const API_SUCCESS = '@@redux-api-middleware/API_SUCCESS';

export default function reduxApiMiddleware(client) {
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
          parentType: API_SUCCESS,
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
          parentType: API_FAILURE,
          error: err.response ? err.response.data || err.response.statusText : err,
          status: err.response ? err.response.status : null,
          headers: err.response ? err.response.headers : null
        });
        if (reject) throw err;
      });
  };
}
