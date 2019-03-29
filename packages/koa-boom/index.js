const boomHelper = (ctx, boomError) => {
  ctx.status = boomError.output.payload.statusCode;
  ctx.body = boomError.output.payload;
  if (ctx.status === 400) {
    const validation =
      typeof boomError.data === 'string' ?
        [
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
}

module.exports = () => (ctx, next) => {
  ctx.boom = (boomError) => boomHelper(ctx, boomError);
  return next();
};

module.exports.boomHelper = boomHelper;
