module.exports = function maintenance(
  isOn = false,
  options = {
    status: 503,
    body: {
      message: 'We are currently down for maintenance.',
      error: 'maintenance'
    }
  }
) {
  return (ctx, next) => {
    if (isOn) {
      ctx.status = options.status;
      ctx.body = options.body;
      return;
    }
    return next();
  };
};
