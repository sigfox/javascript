const chai = require('chai');
const Joi = require('joi');
const { describe, it } = require('mocha');

require('../.')(Joi);

const ORDER_FIELDS = ['createdAt', 'updatedAt'];

const schema = Joi.queryOrder(ORDER_FIELDS);

describe('joi-query: order', () => {
  describe('with invalid type', () => {
    it('fails', async () => {
      const result = Joi.validate(42, schema);
      chai.expect(result.error.message).to.equal('"value" must be an object');
    });
  });

  describe('with invalid child key', () => {
    it('fails', async () => {
      const result = Joi.validate({ wrongKey: 'asc' }, schema);
      chai.expect(result.error.message).to.equal('"wrongKey" is not allowed');
    });
  });

  describe('with invalid child value', () => {
    it('fails', async () => {
      const result = Joi.validate({ [ORDER_FIELDS[0]]: 'toto' }, schema);
      chai
        .expect(result.error.message)
        .to.equal('child "createdAt" fails because ["createdAt" must be one of [asc, desc]]');
    });
  });

  describe(`with child ${ORDER_FIELDS[0]}: 'asc'`, () => {
    it('works', async () => {
      const data = {
        [ORDER_FIELDS[0]]: 'asc'
      };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe(`with child ${ORDER_FIELDS[1]}: 'desc'`, () => {
    it('works', async () => {
      const data = {
        [ORDER_FIELDS[1]]: 'desc'
      };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });

  describe(`with children ${ORDER_FIELDS[0]}: 'asc' and ${ORDER_FIELDS[1]}: 'desc'`, () => {
    it('works', async () => {
      const data = {
        [ORDER_FIELDS[0]]: 'asc',
        [ORDER_FIELDS[1]]: 'desc'
      };
      const result = Joi.validate(data, schema);
      chai.expect(result.error).to.equal(null);
      chai.expect(result.value).to.deep.equal(data);
    });
  });
});
