const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const schema = Joi.queryAltExistsOperator({
  firstname: Joi.string(),
  lastname: Joi.string()
});

describe('joi-query: alt-exists-operator', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate(42, schema);
      chai
        .expect(result.error.message)
        .to.equal('"value" must be an object, "value" must be an object');
    });
  });

  describe('with invalid $exists child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ $exists: { firstname: 42 } }, schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"&#x24;exists" is not allowed, child "&#x24;exists" fails because [child "firstname" fails because ["firstname" must be a string]]'
        );
    });
  });

  describe('with valid value', () => {
    it('works', async () => {
      const data = { firstname: 'theodore' };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe('with valid $exists value', () => {
    it('works', async () => {
      const data = { $exists: { firstname: 'theodore', lastname: 'roosvelt' } };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });
});
