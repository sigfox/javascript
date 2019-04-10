const chai = require('chai');
const Joi = require('joi');
const { before, describe, it } = require('mocha');

require('../.')(Joi);

describe('joi-query: limit', () => {
  describe('with default schema', () => {
    const schema = Joi.queryLimit();

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate({ toto: 42 }, schema);
        chai.expect(result.error.message).to.equal('"value" must be a number');
      });
    });

    describe('with 0', () => {
      it('fails', async () => {
        const result = Joi.validate(0, schema);
        chai.expect(result.error.message).to.equal('"value" must be larger than or equal to 1');
      });
    });

    describe('with 1001', () => {
      it('fails', async () => {
        const result = Joi.validate(1001, schema);
        chai.expect(result.error.message).to.equal('"value" must be less than or equal to 1000');
      });
    });

    describe('with 500', () => {
      it('works', async () => {
        const result = Joi.validate(500, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(500);
      });
    });

    describe('with undefined', () => {
      it('works and sets value to 30', async () => {
        const result = Joi.validate(undefined, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(30);
      });
    });
  });

  describe('with custom schema', () => {
    const schema = Joi.queryLimit(50, 100, 10);

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate({ toto: 42 }, schema);
        chai.expect(result.error.message).to.equal('"value" must be a number');
      });
    });

    describe('with 0', () => {
      it('fails', async () => {
        const result = Joi.validate(0, schema);
        chai.expect(result.error.message).to.equal('"value" must be larger than or equal to 10');
      });
    });

    describe('with 1001', () => {
      it('fails', async () => {
        const result = Joi.validate(1001, schema);
        chai.expect(result.error.message).to.equal('"value" must be less than or equal to 100');
      });
    });

    describe('with 70', () => {
      it('works', async () => {
        const result = Joi.validate(70, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(70);
      });
    });

    describe('with undefined', () => {
      it('works and sets value to 50', async () => {
        const result = Joi.validate(undefined, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(50);
      });
    });
  });
});
