const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));

const koaNunjucks = require('../../koa-nunjucks');
const koaContentSecurityPolicy = require('..');

const { expect, request } = chai;

const getRoutes = () => {
  const router = new Router();

  router.get('/rendering-nunjucks', ctx => ctx.render('page'));

  router.get('/rendering-nunjucks-with-custom-security-policy', ctx =>
    ctx.render(
      'page',
      {},
      {
        contentSecurityPolicy: {
          scriptSrc: ['www.google-analytics.com'],
          styleSrc: ['my.websit.com', "'unsafe-inline'"],
          frameAncestors: ['my.websit.com'],
          fontSrc: ['my.websit.com']
        }
      }
    )
  );

  router.get('/rendering-nunjucks-with-compute-js-nonce-and-custom-policy', ctx =>
    ctx.render(
      'js-nonce',
      {},
      {
        contentSecurityPolicy: {
          scriptSrc: ['www.google-analytics.com'],
          styleSrc: ['my.websit.com', "'unsafe-inline'"],
          frameAncestors: ['my.websit.com'],
          fontSrc: ['my.websit.com']
        }
      }
    )
  );

  return router.routes();
};

const app = new Koa()
  .use(
    koaNunjucks(`${__dirname}/templates`, {
      title: 'I am the title'
    })
  )
  .use(
    koaContentSecurityPolicy({
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      frameAncestors: ["'self'"]
    })
  )
  .use(getRoutes({}))
  .callback();

describe('koa-content-security-policy with nunjuck rendering', () => {
  describe('basic', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/rendering-nunjucks');
      expect(res).to.have.status(200);
      const { 'content-security-policy': contentSecurityPolicy } = res.header;
      expect(contentSecurityPolicy).to.equal(
        "script-src 'self'; style-src 'self'; font-src 'self'; frame-ancestors 'self';"
      );
      expect(res.text).to.equal(
        '<!DOCTYPE html>\n'
          + '<html>\n'
          + '  <head>\n'
          + '    <meta charset="utf-8" />\n'
          + '    <title>I am the title</title>\n'
          + '  </head>\n'
          + '  <body>\n'
          + '    <div>\n'
          + '      <p>my page</p>\n'
          + '    </div>\n'
          + '  </body>\n'
          + '</html>\n'
      );
    });
  });

  describe('with custom security policy', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/rendering-nunjucks-with-custom-security-policy');
      expect(res).to.have.status(200);
      const { 'content-security-policy': contentSecurityPolicy } = res.header;
      expect(contentSecurityPolicy).to.equal(
        "script-src 'self' www.google-analytics.com; style-src 'self' my.websit.com 'unsafe-inline'; font-src 'self' my.websit.com; frame-ancestors 'self' my.websit.com;"
      );
      expect(res.text).to.equal(
        '<!DOCTYPE html>\n'
          + '<html>\n'
          + '  <head>\n'
          + '    <meta charset="utf-8" />\n'
          + '    <title>I am the title</title>\n'
          + '  </head>\n'
          + '  <body>\n'
          + '    <div>\n'
          + '      <p>my page</p>\n'
          + '    </div>\n'
          + '  </body>\n'
          + '</html>\n'
      );
    });
  });

  describe("with 'computeJsNonce' and custom security policy", () => {
    it('returns 200', async () => {
      const res = await request(app).get(
        '/rendering-nunjucks-with-compute-js-nonce-and-custom-policy'
      );
      expect(res).to.have.status(200);
      const { 'content-security-policy': contentSecurityPolicy } = res.header;
      const nonces = contentSecurityPolicy.match(/nonce-[^']+(?=')/g);
      expect(nonces).to.be.an('array');
      expect(nonces.length).to.equal(2);
      expect(contentSecurityPolicy).to.equal(
        `script-src 'self' www.google-analytics.com ${nonces
          .map(nonce => `'${nonce}'`)
          .join(
            ' '
          )}; style-src 'self' my.websit.com 'unsafe-inline'; font-src 'self' my.websit.com; frame-ancestors 'self' my.websit.com;`
      );
      const htmlNonces = nonces.map(nonce => nonce.split('-')[1]);
      expect(res.text).to.equal(
        '<!DOCTYPE html>\n'
          + '<html>\n'
          + '  <head>\n'
          + '    <meta charset="utf-8" />\n'
          + '    <title>I am the title</title>\n'
          + '  </head>\n'
          + '  <body>\n'
          + '    <div>\n'
          + '      <p>my page</p>\n'
          + '    </div>\n'
          + `    <script nonce="${htmlNonces[0]}">\n`
          + "      alert('I am an alert box');\n"
          + '    </script>\n'
          + `    <script nonce="${htmlNonces[1]}">\n`
          + "      alert('I am a second alert box');\n"
          + '    </script>\n'
          + '  </body>\n'
          + '</html>\n'
      );
    });
  });
});
