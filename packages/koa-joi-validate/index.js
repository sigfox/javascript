const { boomHelper } = require('@sigfox/koa-boom');
const boom = require('boom');
const Joi = require('joi');

const throwOnUnsupportedSchemas = (schemas) => {
  const unsupportedSchemas = Object.keys(schemas).filter(
    schema => !['body', 'headers', 'params', 'query'].includes(schema)
  );
  if (unsupportedSchemas.length > 0) {
    throw new Error(`Validation schemas for ${unsupportedSchemas.join(',')} are not supported!`);
  }
};

const koaJoiValidate = (schemasOrFunc, options = {}, preferredJoi) => {
  const joi = preferredJoi || Joi;
  if (typeof schemasOrFunc !== 'function') throwOnUnsupportedSchemas(schemasOrFunc);
  const middleware = async (ctx, next) => {
    try {
      let schemas = schemasOrFunc;
      if (typeof schemasOrFunc === 'function') {
        schemas = await schemasOrFunc(ctx);
        throwOnUnsupportedSchemas(schemas);
      }
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
      Object.keys(schemas).forEach((key) => {
        const request = ctxMappings[key];
        if (!request[key]) request[key] = {};
        const schema = joi.compile(schemas[key]);
        const validation = schema.validate(request[key], joiOptions);
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
      // In joi v10.16 the `path` property is a string using the dot notation to indicate
      // the invalid field, in from version 11 the `path` property is now an array,
      // converting it here into a string following dot notation to avoid breaking changes
      let formattedDetails = err.details;
      if (Array.isArray(err.details)) {
        formattedDetails = err.details.map((detail) => {
          const formattedDetail = { ...detail };
          if (Array.isArray(detail.path)) formattedDetail.path = detail.path.join('.');
          return formattedDetail;
        });
      }
      boomHelper(ctx, boom.badRequest(err.message, formattedDetails));
    }
  };
  middleware.schemas = schemasOrFunc;
  return middleware;
};

module.exports = koaJoiValidate;
