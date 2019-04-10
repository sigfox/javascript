const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const ALLOWED_FIELDS = ['user', 'company', 'hobby'];

const schema = Joi.queryEmbed(ALLOWED_FIELDS);

describe('joi-query: embed', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate(42, schema);
      chai.expect(result.error.message).to.equal('"value" must be an array');
    });
  });

  describe('with invalid field', () => {
    it('fails', async () => {
      const result = Joi.validate([...ALLOWED_FIELDS, 'password'], schema);
      chai
        .expect(result.error.message)
        .to.equal(
          '"value" at position 3 fails because ["3" must be one of [user, company, hobby]]'
        );
    });
  });

  describe('with two valid fields', () => {
    it('works', async () => {
      const result = Joi.validate([ALLOWED_FIELDS[0], ALLOWED_FIELDS[1]], schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal([ALLOWED_FIELDS[0], ALLOWED_FIELDS[1]]);
    });
  });

  describe('with all valid fields', () => {
    it('works', async () => {
      const result = Joi.validate(ALLOWED_FIELDS, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(ALLOWED_FIELDS);
    });
  });
});
