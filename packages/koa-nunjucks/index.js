const nunjucks = require('nunjucks');

module.exports = (path, globals = {}) => {
  const env = nunjucks.configure([path]);
  Object.keys(globals).forEach(key => env.addGlobal(key, globals[key]));

  return async (ctx, next) => {
    if (ctx.render) return next();

    const renderTemplate = (relPath, locals = {}) =>
      new Promise((resolve, reject) => {
        env.render(`${relPath}.njk`, { ...ctx.templateSecurityMethods, ...locals }, (err, html) => {
          if (err) return reject(err);
          resolve(html);
        });
      });

    const renderString = (str, locals = {}) =>
      new Promise((resolve, reject) => {
        env.renderString(str, { ...ctx.templateSecurityMethods, ...locals }, (err, html) => {
          if (err) return reject(err);
          resolve(html);
        });
      });

    ctx.render = async (relPath, locals = {}, { contentSecurityPolicy } = {}) => {
      ctx.set('Content-Type', 'text/html; charset=utf-8');
      ctx.body = await renderTemplate(relPath, locals);
      if (typeof ctx.setContentSecurityPolicy === 'function') {
        ctx.setContentSecurityPolicy(contentSecurityPolicy);
      }
    };
    ctx.renderTemplate = renderTemplate;
    ctx.renderString = renderString;
    await next();
  };
};
