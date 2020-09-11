const nunjucks = require('nunjucks');

module.exports = (path, globals = {}) => {
  const env = nunjucks.configure([path]);
  Object.keys(globals).forEach(key => env.addGlobal(key, globals[key]));

  const renderTemplate = (relPath, locals = {}) =>
    new Promise((resolve, reject) => {
      env.render(`${relPath}.njk`, locals, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

  const renderString = (str, locals = {}) =>
    new Promise((resolve, reject) => {
      env.renderString(str, locals, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

  return async (ctx, next) => {
    if (ctx.render) return next();
    ctx.render = async (relPath, locals = {}) => {
      ctx.set('Content-Type', 'text/html; charset=utf-8');
      ctx.body = await renderTemplate(relPath, locals);
    };
    ctx.renderTemplate = renderTemplate;
    ctx.renderString = renderString;
    await next();
  };
};
