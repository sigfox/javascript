const chai = require('chai');
const chaiHttp = require('chai-http');
const Koa = require('koa');
const Router = require('koa-router');
const { describe, it } = require('mocha');
const errorHandler = require('..');

chai.use(chaiHttp);

const html = '<!DOCTYPE html><html lang="en"><body></body></html>';
const defaultHTML = '<!DOCTYPE html><html lang="en"><body><p>Other HTML</p></body></html>';

const getRoutes = () => {
  const router = new Router();

  router.get('/ok', (ctx) => {
    ctx.status = 200;
  });

  router.get('/bug', () => {
    throw new Error('it bugs');
  });

  return router.routes();
};

const app = new Koa()
  .use(errorHandler())
  .use(getRoutes())
  .callback();

const appWithHtmlRenderer = new Koa()
  .use(
    errorHandler({
      renderHTML: () => Promise.resolve(html)
    })
  )
  .use(getRoutes())
  .callback();

const appWithHtml = new Koa()
  .use(
    errorHandler({
      html
    })
  )
  .use(getRoutes())
  .callback();

const appWithBuggyHtmlRenderer = new Koa()
  .use(
    errorHandler({
      renderHTML: () => {
        throw new Error('something went wrong');
      },
      html: defaultHTML
    })
  )
  .use(getRoutes())
  .callback();

describe('koa-error-handler', () => {
  describe('without bug', () => {
    it('returns 200', async () => {
      const res = await chai.request(app).get('/ok');
      chai.expect(res).to.have.status(200);
    });
  });

  describe('with error thrown without header "accept" or other config', () => {
    it('returns 500 and a json body', async () => {
      const res = await chai.request(app).get('/bug');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      chai.expect(res.body).to.deep.equal({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      });
    });
  });

  describe('with error thrown and header "accept" to application/json', () => {
    it('returns 500 and a json body', async () => {
      const res = await chai
        .request(appWithHtmlRenderer)
        .get('/bug')
        .set('accept', 'application/json');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      chai.expect(res.body).to.deep.equal({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      });
    });
  });

  describe('with error thrown with neither renderHTML or html parameters are given while header "accept" is set to text/html ', () => {
    it('returns 500 and a json body', async () => {
      const res = await chai
        .request(app)
        .get('/bug')
        .set('accept', 'text/html');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      chai.expect(res.body).to.deep.equal({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      });
    });
  });

  describe('with error thrown with renderHTML parameter used', () => {
    it('returns 500 and a html body', async () => {
      const res = await chai
        .request(appWithHtmlRenderer)
        .get('/bug')
        .set('accept', 'text/html');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
      chai.expect(res.text).to.equal(html);
    });
  });

  describe('with error thrown with html parameter used', () => {
    it('returns 500 and a html body', async () => {
      const res = await chai
        .request(appWithHtml)
        .get('/bug')
        .set('accept', 'text/html');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
      chai.expect(res.text).to.equal(html);
    });
  });

  describe('with error thrown and with a buggy renderHTML function and the html parameter set', () => {
    it('returns 500 and a html body corresponding to the html argument given', async () => {
      const res = await chai
        .request(appWithBuggyHtmlRenderer)
        .get('/bug')
        .set('accept', 'text/html');
      chai.expect(res).to.have.status(500);
      chai.expect(res.headers['content-type']).to.equal('text/html; charset=utf-8');
      chai.expect(res.text).to.equal(defaultHTML);
    });
  });
});
