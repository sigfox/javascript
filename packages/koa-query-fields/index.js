const omit = require('lodash/omit');
const pick = require('lodash/pick');

const toJSON = obj => (obj.toJSON ? obj.toJSON() : obj);

const pickFields = (obj, fields) => {
  const cleanObj = toJSON(obj);
  return pick(cleanObj, fields);
};

module.exports = async (ctx, next) => {
  await next();
  if (ctx.state.ignoreQueryFields) return;

  const hasFields =
    ctx.query && ctx.query.fields && Array.isArray(ctx.query.fields) && ctx.query.fields.length > 0;
  const hasBody = ctx.body;

  if (hasFields && hasBody) {
    const { fields } = ctx.query;
    if (Array.isArray(ctx.body)) {
      ctx.body = ctx.body.map(obj => pickFields(obj, fields));
    } else if (typeof ctx.body.total === 'number' && Array.isArray(ctx.body.data)) {
      ctx.body = {
        ...omit(ctx.body, ['data']),
        data: ctx.body.data.map(obj => pickFields(obj, fields))
      };
    } else if (typeof ctx.body === 'object') {
      ctx.body = pickFields(ctx.body, fields);
    }
  }
};
