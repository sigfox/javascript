const { boomHelper } = require('@sigfox/koa-boom');
const boom = require('boom');
const Joi = require('joi');

const koaJoiValidate = (schemasOrFunc, options = {}) => {
  const unsupportedSchemas = Object.keys(schemasOrFunc).filter(
    schema => !['body', 'headers', 'params', 'query'].includes(schema)
  );
  if (unsupportedSchemas.length > 0) {
    throw new Error(`Validation schemas for ${unsupportedSchemas.join(',')} are not supported!`);
  }
  const middleware = async (ctx, next) => {
    try {
      let schemas = schemasOrFunc;
      if (typeof schemasOrFunc === 'function') schemas = await schemasOrFunc(ctx);
      Object.keys(schemas).forEach((key) => {
        if (!ctx[key]) ctx[key] = {};
        const joiOptions = {
          stripUnknown: { arrays: false, objects: true },
          convert: true,
          abortEarly: false,
          ...options
        };
        const ctxMappings = {
          body: ctx.request,
          headers: ctx.request,
          params: ctx,
          query: ctx.request
        };
        const request = ctxMappings[key];
        const validation = Joi.validate(request[key], schemas[key], joiOptions);
        if (validation.error) throw validation.error;
        // Override query setter and getter which use a cache using the querystring as key
        // but it does not consider default value set by Joi schema
        // e.g: setting query with { embed: [] } => will result into => {}
        // on the next get of the query
        if (key === 'query') {
          Object.defineProperty(request, 'query', {
            set: function set(value) {
              this.validatedQuery = value;
            },
            get: function get() {
              return this.validatedQuery;
            }
          });
        }
        request[key] = validation.value;
      });
      await next();
    } catch (err) {
      if (err.name !== 'ValidationError') throw err;
      boomHelper(ctx, boom.badRequest(err.message, err.details));
    }
  };
  middleware.schemas = schemasOrFunc;
  return middleware;
};

module.exports = koaJoiValidate;
