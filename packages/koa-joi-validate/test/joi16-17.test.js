const chai = require('chai');
const chaiHttp = require('chai-http');
const Joi16 = require('joi16');
const Joi17 = require('joi17');
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
  city: 'Banshee',
  address: {
    number: '35A',
    street: 'Ford avenue'
  }
};
const policeManController = (ctx) => {
  ctx.status = 200;
  ctx.body = ctx.request.body;
};

[Joi16, Joi17].forEach((Joi) => {
  const policeManValidate = koaJoiValidate(
    {
      body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        age: Joi.number()
          .min(21)
          .max(70)
          .required(),
        job: Joi.valid('Deputy', 'Sheriff').required(),
        city: Joi.string().required(),
        address: Joi.object()
          .keys({
            number: Joi.string().min(1),
            street: Joi.string()
              .min(1)
              .required()
          })
          .required()
      }),
      query: Joi.object().keys({
        jobType: Joi.valid('Deputy', 'Sheriff')
      })
    },
    {},
    Joi
  );

  const policeManFuncValidate = koaJoiValidate(
    ctx => ({
      body: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        age: Joi.number()
          .min(21)
          .max(70)
          .required(),
        job: Joi.valid(...ctx.config.jobTypes).required(),
        city: Joi.string().required(),
        address: Joi.object()
          .keys({
            number: Joi.string().min(1),
            street: Joi.string()
              .min(1)
              .required()
          })
          .required()
      }),
      query: Joi.object().keys({
        jobType: Joi.valid(...ctx.config.jobTypes)
      })
    }),
    {},
    Joi
  );

  describe(`koa-joi-validate using Joi v${Joi.version}`, () => {
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

    describe('when middleware is created with unsupported schemas keys (passing an object to give schemas)', () => {
      it('should throw an Error with unsupported schemas keys list', () => {
        const unsupportedValidate = () =>
          koaJoiValidate({
            qery: Joi.object().keys({
              name: Joi.string().required()
            }),
            bdy: Joi.object().keys({
              name: Joi.string().required()
            })
          });
        chai
          .expect(unsupportedValidate)
          .to.throw(Error, 'Validation schemas for qery,bdy are not supported!');
      });
    });

    describe('when middleware is created with unsupported schemas keys (passing a function to give schemas)', () => {
      it('should throw an Error with unsupported schemas keys list', async () => {
        // N.B: when a function is used instead of an object the error happens at during the
        // usage of the middleware not at the creation of the middleware since the schemas
        // are generated based on the given `ctx`.
        const unsupportedValidate = () =>
          koaJoiValidate(ctx => ({
            qery: Joi.object().keys({
              name: Joi.string().required()
            }),
            bdy: Joi.object().keys({
              name: Joi.string()
                .valid(...ctx.config.names)
                .required()
            })
          }))({ config: { names: ['charlie', 'jeremie'] } }, () => {});

        return chai
          .expect(unsupportedValidate())
          .to.be.rejectedWith(Error, 'Validation schemas for qery,bdy are not supported!');
      });
    });

    [
      { middleware: policeManValidate, label: 'passing an object to give schemas' },
      { middleware: policeManFuncValidate, label: 'passing a function to give schemas' }
    ].forEach(({ middleware, label }) => {
      describe(`when middleware is mounted (${label})`, () => {
        const app = new Koa()
          .use(bodyParser())
          .use((ctx, next) => {
            ctx.config = { jobTypes: ['Deputy', 'Sheriff'] };
            return next();
          })
          .use(middleware)
          .use(policeManController)
          .callback();

        describe('with a body to validate', () => {
          it('should reply 200', async () => {
            const res = await chai
              .request(app)
              .post('/')
              .send(policeMan);
            res.should.have.status(200);
            chai.expect(res.body).to.deep.include(policeMan);
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
                '"firstname" is required. '
                  + '"lastname" is required. '
                  + '"age" is required. '
                  + '"job" is required. '
                  + '"city" is required. '
                  + '"address" is required'
              );
            ['firstname', 'lastname', 'age', 'job', 'city', 'address'].forEach((field, index) => {
              chai.expect(res.body.validation[index].message).to.equal(`"${field}" is required`);
              chai.expect(res.body.validation[index].path).to.equal(field);
              chai.expect(res.body.validation[index].type).to.equal('any.required');
            });
          });

          it('should reply 400', async () => {
            const policeManWithoutStreet = { ...policeMan, address: { number: '23' } };
            const res = await chai
              .request(app)
              .post('/')
              .send(policeManWithoutStreet);
            res.should.have.status(400);
            chai.expect(res.body.message).to.equal('"address.street" is required');
            chai.expect(res.body.validation[0].message).to.equal('"address.street" is required');
            chai.expect(res.body.validation[0].path).to.equal('address.street');
            chai.expect(res.body.validation[0].type).to.equal('any.required');
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
            chai.expect(res.body.message).to.equal('"jobType" must be one of [Deputy, Sheriff]');
            chai
              .expect(res.body.validation[0].message)
              .to.equal('"jobType" must be one of [Deputy, Sheriff]');
            chai.expect(res.body.validation[0].path).to.equal('jobType');
            chai.expect(res.body.validation[0].type).to.equal('any.only');
          });
        });
      });
    });
  });
});
