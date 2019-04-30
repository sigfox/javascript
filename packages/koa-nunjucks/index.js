const nunjucks = require('nunjucks');

module.exports = (path, globals = {}) => {
  const env = nunjucks.configure([path]);
  Object.keys(globals).forEach(key => env.addGlobal(key, globals[key]));

  return async (ctx, next) => {
    if (ctx.render) return next();
    ctx.render = (relPath, locals = {}) => {
      const promise = new Promise((resolve, reject) => {
        env.render(`${relPath}.njk`, locals, (err, html) => {
          if (err) return reject(err);
          ctx.set('Content-Type', 'text/html; charset=utf-8');
          ctx.body = html;
          resolve();
        });
      });
      return promise;
    };
    await next();
  };
};
