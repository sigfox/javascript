const chai = require('chai');
const chaiHttp = require('chai-http');
const Joi = require('joi');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { describe, it } = require('mocha');
const koaJoiValidate = require('..');

chai.use(chaiHttp);
chai.should();

const policeMan = {
  firstname: 'Lucas',
  lastname: 'Hood',
  age: 44,
  job: 'Sheriff',
  city: 'Banshee'
};
const policeManController = (ctx) => {
  ctx.status = 200;
  ctx.body = ctx.request.body;
};
const policeManValidate = koaJoiValidate({
  body: Joi.object()
    .keys({
      firstname: Joi.string(),
      lastname: Joi.string(),
      age: Joi.number()
        .min(21)
        .max(70),
      job: Joi.only('Deputy', 'Sheriff'),
      city: Joi.string()
    })
    .requiredKeys(['firstname', 'lastname', 'age', 'job', 'city']),
  query: Joi.object().keys({
    jobType: Joi.only('Deputy', 'Sheriff')
  })
});

describe('koa-joi-validate', () => {
  describe('when middleware is not mounted', () => {
    const app = new Koa()
      .use(bodyParser())
      .use(policeManController)
      .callback();

    it('should allow any request', async () => {
      const res = await chai
        .request(app)
        .post('/')
        .send({ any: 'anyValue' });
      res.should.have.status(200);
    });
  });

  describe('when middleware is mounted', () => {
    const app = new Koa()
      .use(bodyParser())
      .use(policeManValidate)
      .use(policeManController)
      .callback();

    describe('with a body to validate', () => {
      it('should reply 200', async () => {
        const res = await chai
          .request(app)
          .post('/')
          .send(policeMan);
        res.should.have.status(200);
        chai.expect(res.body).to.include(policeMan);
      });

      it('should reply 400', async () => {
        const res = await chai
          .request(app)
          .post('/')
          .send({ test: 'test' });
        res.should.have.status(400);
        chai
          .expect(res.body.message)
          .to.equal(
            'child "firstname" fails because ["firstname" is required]. '
              + 'child "lastname" fails because ["lastname" is required]. '
              + 'child "age" fails because ["age" is required]. '
              + 'child "job" fails because ["job" is required]. '
              + 'child "city" fails because ["city" is required]'
          );
      });
    });

    describe('with a query to validate', () => {
      it('should reply 200', async () => {
        const res = await chai
          .request(app)
          .post('/?jobType=Sheriff')
          .send(policeMan);
        res.should.have.status(200);
      });

      it('should reply 400', async () => {
        const res = await chai
          .request(app)
          .post('/?jobType=NotValid')
          .send(policeMan);
        res.should.have.status(400);
        chai
          .expect(res.body.message)
          .to.equal('child "jobType" fails because ["jobType" must be one of [Deputy, Sheriff]]');
      });
    });
  });
});
