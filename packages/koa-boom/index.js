const defaultValidationError = ctx => ctx.status === 400;

const boomHelper = (ctx, boomError, isValidationError = defaultValidationError) => {
  ctx.status = boomError.output.payload.statusCode;
  ctx.body = boomError.output.payload;
  if (isValidationError(ctx)) {
    const validation =
      typeof boomError.data === 'string' ? [
            {
              message: ctx.body.message,
              path: boomError.data,
              type: 'custom',
              context: { key: boomError.data }
            }
          ]
        : boomError.data;
    ctx.body.validation = validation;
  }
};

module.exports = (isValidationError = defaultValidationError) => (ctx, next) => {
  ctx.boom = boomError => boomHelper(ctx, boomError, isValidationError);
  return next();
};

module.exports.boomHelper = boomHelper;
