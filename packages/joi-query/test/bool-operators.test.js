const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const schema = Joi.queryBoolOperators({
  firstname: Joi.string(),
  lastname: Joi.string()
});

describe('joi-query: bool-operators', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate(42, schema);
      chai.expect(result.error.message).to.equal('"value" must be an object');
    });
  });

  describe('with invalid child key', () => {
    it('fails', async () => {
      const result = Joi.validate({ firstname: 'theodore' }, schema);
      chai.expect(result.error.message).to.equal('"firstname" is not allowed');
    });
  });

  describe('with invalid $and child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $and: { firstname: 42 } }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          'child "&#x24;and" fails because [child "firstname" fails because ["firstname" must be a string]]'
        );
    });
  });

  describe('with invalid $or child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $or: [{ lastname: 'roosvelt' }] }, schema);
      chai
        .expect(result.error.message)
        .to.equal('child "&#x24;or" fails because ["&#x24;or" must be an object]');
    });
  });

  describe('with valid $and value', () => {
    it('works', async () => {
      const data = { $and: { firstname: 'theodore', lastname: 'roosvelt' } };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe('with valid $or value', () => {
    it('works', async () => {
      const data = { $or: { firstname: 'theodore', lastname: 'roosvelt' } };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });
});
