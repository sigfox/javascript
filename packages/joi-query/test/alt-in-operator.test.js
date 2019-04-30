const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

describe('joi-query: alt-in-operator', () => {
  describe('with default schema', () => {
    const schema = Joi.queryAltInOperator(Joi.number());

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate('toto', schema);
        chai
          .expect(result.error.message)
          .to.equal('"value" must be a number, "value" must be an object');
      });
    });

    describe('with invalid $in child value', () => {
      it('fails', async () => {
        const result = Joi.validate({ $in: 'toto' }, schema);
        chai
          .expect(result.error.message)
          .to.equal(
            '"value" must be a number, child "&#x24;in" fails because ["&#x24;in" must be an array]'
          );
      });
    });

    describe('with $in child empty array', () => {
      it('fails', async () => {
        const data = { $in: [] };
        const result = Joi.validate(data, schema);
        chai
          .expect(result.error.message)
          .to.equal(
            '"value" must be a number, child "&#x24;in" fails because ["&#x24;in" must contain at least 1 items]'
          );
      });
    });

    describe('with $in child array with 101 elements', () => {
      it('fails', async () => {
        const data = { $in: [...new Array(101)].map((a, index) => index + 1) };
        const result = Joi.validate(data, schema);
        chai
          .expect(result.error.message)
          .to.equal(
            '"value" must be a number, child "&#x24;in" fails because ["&#x24;in" must contain less than or equal to 100 items]'
          );
      });
    });

    describe('with valid value as a number', () => {
      it('works', async () => {
        const result = Joi.validate(42, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(42);
      });
    });

    describe('with valid value as a string', () => {
      it('works', async () => {
        const result = Joi.validate('42', schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(42);
      });
    });

    describe('with valid $in value', () => {
      it('works', async () => {
        const data = { $in: [42, '34'] };
        const result = Joi.validate(data, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.deep.equal({ $in: [42, 34] });
      });
    });
  });

  describe('with custom schema', () => {
    const schema = Joi.queryAltInOperator(Joi.number(), 10, 0);

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate('toto', schema);
        chai
          .expect(result.error.message)
          .to.equal('"value" must be a number, "value" must be an object');
      });
    });

    describe('with invalid $in child value', () => {
      it('fails', async () => {
        const result = Joi.validate({ $in: 'toto' }, schema);
        chai
          .expect(result.error.message)
          .to.equal(
            '"value" must be a number, child "&#x24;in" fails because ["&#x24;in" must be an array]'
          );
      });
    });

    describe('with $in child array with 11 elements', () => {
      it('fails', async () => {
        const data = { $in: [...new Array(11)].map((a, index) => index) };
        const result = Joi.validate(data, schema);
        chai
          .expect(result.error.message)
          .to.equal(
            '"value" must be a number, child "&#x24;in" fails because ["&#x24;in" must contain less than or equal to 10 items]'
          );
      });
    });

    describe('with $in child empty array', () => {
      it('works', async () => {
        const data = { $in: [] };
        const result = Joi.validate(data, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.deep.equal(data);
      });
    });

    describe('with valid value as a number', () => {
      it('works', async () => {
        const result = Joi.validate(42, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(42);
      });
    });

    describe('with valid value as a string', () => {
      it('works', async () => {
        const result = Joi.validate('42', schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(42);
      });
    });

    describe('with valid $in value', () => {
      it('works', async () => {
        const data = { $in: [42, '34'] };
        const result = Joi.validate(data, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.deep.equal({ $in: [42, 34] });
      });
    });
  });
});
