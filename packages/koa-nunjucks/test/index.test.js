const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));

const koaNunjucks = require('..');

const getRoutes = () => {
  const router = new Router();

  router.get('/page/render-template', async (ctx) => {
    ctx.body = await ctx.renderTemplate('page');
  });
  router.get('/page/render-string', async (ctx) => {
    ctx.body = await ctx.renderString('Hello {{ username }}', { username: 'James' });
  });
  router.get('/page/:content/:title', async ctx =>
    ctx.render('page', { content: ctx.params.content, title: ctx.params.title })
  );
  router.get('/page/:content', async ctx => ctx.render('page', { content: ctx.params.content }));
  router.get('/page', async ctx => ctx.render('page'));

  return router.routes();
};

const app = new Koa()
  .use(
    koaNunjucks(`${__dirname}/templates`, {
      title: 'I am the title'
    })
  )
  .use(getRoutes())
  .callback();

describe('koa-nunjucks', () => {
  describe('with content: 42 & title: foobar', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/42/foobar');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>foobar</title>\n  </head>\n  <body>\n    <div>\n      <p>42</p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with content: lorem & title: ipsum', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/lorem/ipsum');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>ipsum</title>\n  </head>\n  <body>\n    <div>\n      <p>lorem</p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with content: toto', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/foobar');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>I am the title</title>\n  </head>\n  <body>\n    <div>\n      <p>foobar</p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with content: CONTENT', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/CONTENT');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>I am the title</title>\n  </head>\n  <body>\n    <div>\n      <p>CONTENT</p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with no content', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>I am the title</title>\n  </head>\n  <body>\n    <div>\n      <p></p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with no content and with helper method ctx.renderTemplate', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/render-template');
      chai.expect(res).to.have.status(200);
      chai
        .expect(res.text)
        .to.equal(
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>I am the title</title>\n  </head>\n  <body>\n    <div>\n      <p></p>\n    </div>\n  </body>\n</html>\n'
        );
    });
  });

  describe('with no content and with helper method ctx.renderString', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/page/render-string');
      chai.expect(res).to.have.status(200);
      chai.expect(res.text).to.equal('Hello James');
    });
  });
});
