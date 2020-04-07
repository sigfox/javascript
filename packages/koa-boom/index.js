const defaultValidationError = ctx => ctx.status === 400;

const boomHelper = (ctx, boomError, isValidationError = defaultValidationError) => {
  ctx.status = boomError.output.payload.statusCode;
  ctx.body = boomError.output.payload;
  if (isValidationError(ctx)) {
    let validation = [];
    if (typeof boomError.data === 'string') {
      const lastKey = boomError.data.split('.').pop();
      validation = [
        {
          message: ctx.body.message,
          path: boomError.data,
          type: 'custom',
          context: { key: lastKey }
        }
      ];
    } else if (Array.isArray(boomError.data)) {
      validation = boomError.data;
    } else if (boomError.data && boomError.data.field && typeof boomError.data === 'object') {
      const lastKey = boomError.data.field.split('.').pop();
      validation = [
        {
          message: ctx.body.message,
          path: boomError.data.field,
          type: boomError.data.type || 'custom',
          context: { key: lastKey, value: boomError.data.value }
        }
      ];
    }
    ctx.body.validation = validation;
  }
};

module.exports = (isValidationError = defaultValidationError) => (ctx, next) => {
  ctx.boom = boomError => boomHelper(ctx, boomError, isValidationError);
  return next();
};

module.exports.boomHelper = boomHelper;
