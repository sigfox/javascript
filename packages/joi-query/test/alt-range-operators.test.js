const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const schema = Joi.queryAltRangeOperators(Joi.number());

describe('joi-query: alt-range-operators', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate('toto', schema);
      chai
        .expect(result.error.message)
        .to.equal('"value" must be a number, "value" must be an object');
    });
  });

  describe('with invalid $lt child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $lt: 'toto' }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"value" must be a number, child "&#x24;lt" fails because ["&#x24;lt" must be a number]'
        );
    });
  });

  describe('with invalid $lte child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $lte: 'toto' }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"value" must be a number, child "&#x24;lte" fails because ["&#x24;lte" must be a number]'
        );
    });
  });

  describe('with invalid $gt child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $gt: 'toto' }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"value" must be a number, child "&#x24;gt" fails because ["&#x24;gt" must be a number]'
        );
    });
  });

  describe('with invalid $gte child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $gte: 'toto' }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"value" must be a number, child "&#x24;gte" fails because ["&#x24;gte" must be a number]'
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

  describe('with valid $lt value', () => {
    it('works', async () => {
      const data = { $lt: 42 };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe('with valid $lte value', () => {
    it('works', async () => {
      const data = { $lte: 42 };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe('with valid $gt value', () => {
    it('works', async () => {
      const data = { $gt: 42 };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe('with valid $gte value', () => {
    it('works', async () => {
      const data = { $gte: 42 };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });
});
