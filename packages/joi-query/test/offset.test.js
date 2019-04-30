const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

describe('joi-query: offset', () => {
  describe('with default schema', () => {
    const schema = Joi.queryOffset();

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate({ toto: 42 }, schema);
        chai.expect(result.error.message).to.equal('"value" must be a number');
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
      it('works and sets value to 0', async () => {
        const result = Joi.validate(undefined, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(0);
      });
    });
  });

  describe('with custom schema', () => {
    const schema = Joi.queryOffset(100);

    describe('with invalid type', () => {
      it('fails', async () => {
        const result = Joi.validate({ toto: 42 }, schema);
        chai.expect(result.error.message).to.equal('"value" must be a number');
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
      it('works and sets value to 100', async () => {
        const result = Joi.validate(undefined, schema);
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(100);
      });
    });
  });
});
