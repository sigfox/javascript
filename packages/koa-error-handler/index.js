const defaultHTML = `<!DOCTYPE html>
    <html>
      <head><title>Oops</title></head>
      <body>
        <h3>Oops something wrong happened...</h3>
        <b>That's our fault, your did nothing wrong.</b>
        <p>Please bear with us, our team is already working on it.</p>
      </body>
    </html>`;

module.exports = ({ renderHTML, html } = {}) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const contentType = ctx.accepts('html', 'json');
    const hasHtmlRenderer = typeof renderHTML === 'function' || html;
    if (hasHtmlRenderer && contentType === 'html') {
      ctx.type = 'text/html';
      try {
        ctx.body = html;
        if (renderHTML) {
          ctx.body = await renderHTML(ctx);
        }
      } catch (renderError) {
        ctx.app.emit('error', renderError);
        ctx.body = html || defaultHTML;
      }
    } else {
      ctx.type = 'application/json';
      ctx.body = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      };
    }
    ctx.status = 500;
    ctx.app.emit('error', err);
  }
};
