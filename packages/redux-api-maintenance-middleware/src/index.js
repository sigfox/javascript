import { API_FAILURE } from '@sigfox/redux-api-middleware';
import isSubset from 'is-subset';

export const API_MAINTENANCE = '@@redux-api-maintenance-middleware/API_MAINTENANCE';

export default function reduxApiMaintenanceMiddleware(
  options = { status: 503, error: { error: 'maintenance' } }
) {
  return ({ dispatch }) => next => (action) => {
    if (
      action.parentType === API_FAILURE
      && action.status === options.status
      && isSubset(action.error, options.error)
    ) {
      dispatch({
        type: API_MAINTENANCE,
        status: action.status,
        error: action.error,
        headers: action.headers
      });

      return next({ ...action, maintenance: true });
    }
    next(action);
  };
}
