module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    };
    ctx.app.emit('error', err);
  }
};
