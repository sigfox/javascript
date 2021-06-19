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

  router.get('/rendering-string-nunjucks', async (ctx) => {
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = await ctx.renderString('Hello {{ username }}', {
      username: 'James'
    });
    ctx.setContentSecurityPolicy();
  });

  router.get('/rendering-string-nunjucks-with-compute-js-nonce', async (ctx) => {
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = await ctx.renderString(
      'Hello {{ username }} Nonces: {{ computeJsNonce() }}-{{ computeJsNonce() }}',
      {
        username: 'James'
      }
    );
    ctx.setContentSecurityPolicy();
  });

  router.get('/rendering-string-nunjucks-with-compute-js-nonce-and-custom-policy', async (ctx) => {
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = await ctx.renderString(
      'Hello {{ username }} Nonces: {{ computeJsNonce() }}-{{ computeJsNonce() }}',
      {
        username: 'James'
      }
    );
    ctx.setContentSecurityPolicy({
      scriptSrc: ['www.google-analytics.com'],
      styleSrc: ['my.websit.com', "'unsafe-inline'"],
      frameAncestors: ['my.websit.com'],
      fontSrc: ['my.websit.com']
    });
  });

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

describe('koa-content-security-policy with nunjuck string rendering', () => {
  describe('basic string', () => {
    it('returns 200', async () => {
      const res = await request(app).get('/rendering-string-nunjucks');
      expect(res).to.have.status(200);
      const { 'content-security-policy': contentSecurityPolicy } = res.header;
      expect(contentSecurityPolicy).to.equal(
        "script-src 'self'; style-src 'self'; font-src 'self'; frame-ancestors 'self';"
      );
      expect(res.text).to.equal('Hello James');
    });
  });

  describe("with 'computeJsNonce'", () => {
    it('returns 200', async () => {
      const res = await request(app).get('/rendering-string-nunjucks-with-compute-js-nonce');
      expect(res).to.have.status(200);
      const { 'content-security-policy': contentSecurityPolicy } = res.header;
      const nonces = contentSecurityPolicy.match(/nonce-[^']+(?=')/g);
      expect(nonces).to.be.an('array');
      expect(nonces.length).to.equal(2);
      expect(contentSecurityPolicy).to.equal(
        `script-src 'self' ${nonces
          .map(nonce => `'${nonce}'`)
          .join(' ')}; style-src 'self'; font-src 'self'; frame-ancestors 'self';`
      );
      const expectedHtml = `Hello James Nonces: ${nonces
        .map(nonce => nonce.split('-')[1])
        .join('-')}`;
      expect(res.text).to.equal(expectedHtml);
    });
  });

  describe("with 'computeJsNonce' and custom security policy", () => {
    it('returns 200', async () => {
      const res = await request(app).get(
        '/rendering-string-nunjucks-with-compute-js-nonce-and-custom-policy'
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
      const expectedHtml = `Hello James Nonces: ${nonces
        .map(nonce => nonce.split('-')[1])
        .join('-')}`;
      expect(res.text).to.equal(expectedHtml);
    });
  });
});
