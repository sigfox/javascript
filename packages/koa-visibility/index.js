const omit = require('lodash/omit');
const pick = require('lodash/pick');
const uniq = require('lodash/uniq');

const getVisibleFields = (config, roles) =>
  uniq(roles.reduce((acc, role) => (config[role] ? [...acc, ...config[role]] : acc), []));

const toJSON = obj => (obj.toJSON ? obj.toJSON() : obj);

const pickFields = (obj, fields) => {
  const cleanObj = toJSON(obj);
  return pick(cleanObj, fields);
};

module.exports = config => async (ctx, next) => {
  await next();
  const {
    body,
    state: { user, roles = [] }
  } = ctx;
  const userRoles = ['public', ...((user && user.roles) || roles)];
  const readableFields = getVisibleFields(config, userRoles);
  if (Array.isArray(body)) {
    ctx.body = body.map(obj => pickFields(obj, readableFields));
  } else if (typeof body.total === 'number' && Array.isArray(body.data)) {
    ctx.body = {
      ...omit(body, ['data']),
      data: body.data.map(obj => pickFields(obj, readableFields))
    };
  } else if (typeof body === 'object') {
    ctx.body = pickFields(body, readableFields);
  }
};
