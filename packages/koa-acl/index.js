const { boomHelper } = require('@sigfox/koa-boom');
const boom = require('boom');
const intersection = require('lodash.intersection');

module.exports = (acl) => {
  const middlewares = {};
  if (acl.roles) {
    middlewares.meta = { roles: acl.roles };
    middlewares.roles = (ctx, next) => {
      const { user, roles = [] } = ctx.state;
      const hasRole = intersection(acl.roles, (user && user.roles) || roles).length > 0;
      if (!hasRole) return boomHelper(ctx, boom.forbidden());
      return next();
    };
  }
  if (acl.query) {
    middlewares.query = (ctx, next) => {
      if (acl.query) {
        return Promise.resolve(acl.query(ctx)).then((isGranted) => {
          if (isGranted instanceof Error) return boomHelper(ctx, isGranted);
          if (!isGranted) return boomHelper(ctx, boom.forbidden());
          return next();
        });
      }
      return next();
    };
  }
  return middlewares;
};
