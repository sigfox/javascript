const formidable = require('formidable');

const middleware = (module.exports = options => async (ctx, next) => {
  if (ctx.request.type === 'multipart/form-data') {
    const form = await middleware.parse(options)(ctx.request.req);
    ctx.request.body = form;
  }
  return next();
});

middleware.parse = (options = {}) => (stream) => {
  const form =
    options instanceof formidable.IncomingForm ? options : new formidable.IncomingForm(options);
  return new Promise((resolve, reject) => {
    const fields = {};
    form.on('field', (name, value) => {
      if (name.substr(name.length - 2) === '[]') {
        // eslint-disable-next-line no-param-reassign
        name = name.substr(0, name.length - 2);
        if (!fields[name] || !Array.isArray(fields[name])) {
          fields[name] = [value];
        } else {
          fields[name].push(value);
        }
      } else {
        fields[name] = value;
      }
    });
    form.parse(stream, (err, formidableFields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};
