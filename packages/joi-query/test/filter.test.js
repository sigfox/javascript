const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const schema = Joi.queryFilter({
  name: Joi.string()
});

describe('joi-query: filter', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate(42, schema);
      chai.expect(result.error.message).to.equal('"value" must be an object');
    });
  });

  describe('with invalid child', () => {
    it('fails', async () => {
      const result = Joi.validate({ name: 42 }, schema);
      chai
        .expect(result.error.message)
        .to.equal('child "name" fails because ["name" must be a string]');
    });
  });

  describe('with valid child', () => {
    it('works', async () => {
      const data = { name: 'ahmed' };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });
});
