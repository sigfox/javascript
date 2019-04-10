const chai = require('chai');
const joi = require('joi');
const { describe, it } = require('mocha');

const joiExtended = joi.extend(require('../'));

describe('joi-phone', () => {
  describe('with validate rule', () => {
    describe('with non E164 compliant phone number', () => {
      it('fails', async () => {
        const value = '07 70 48 29 49';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.not.equal(null);
      });
    });

    describe('with fake prefix', () => {
      it('fails', async () => {
        const value = '0000123456789';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.not.equal(null);
      });
    });

    describe('with valid phone', () => {
      it('success', async () => {
        const value = '+33123456789';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value);
      });
    });

    describe('with valid phone with numbers spaces separated', () => {
      it('success and removes spaces', async () => {
        const value = '+33 7 70 48 29 49';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/ /g, ''));
      });
    });

    describe('with valid phone with numbers dots separated', () => {
      it('success and removes dots', async () => {
        const value = '+337.70.48.29.49';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/\./g, ''));
      });
    });

    describe('with valid phone with numbers space/dashes separated', () => {
      it('success and removes space/dashes', async () => {
        const value = '+337 70-48-29-49';
        const result = joi.validate(value, joiExtended.phone().validate());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/ |-/g, ''));
      });
    });
  });

  describe('with mobile rule', () => {
    describe('with non mobile phone', () => {
      it('success', async () => {
        const value = '+33123456789';
        const result = joi.validate(value, joiExtended.phone().mobile());
        chai.expect(result.error).to.not.equal(null);
      });
    });

    describe('with valid mobile phone', () => {
      it('success', async () => {
        const value = '+32460224941'; // BELGIUM
        const result = joi.validate(value, joiExtended.phone().mobile());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value);
      });
    });

    describe('with valid mobile phone with numbers spaces separated', () => {
      it('success and removes spaces', async () => {
        const value = '+161 49 43 85 97'; // USA
        const result = joi.validate(value, joiExtended.phone().mobile());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/ /g, ''));
      });
    });

    describe('with valid mobile phone with numbers dots separated', () => {
      it('success and removes dots', async () => {
        const value = '+44.7520.632751'; // UK
        const result = joi.validate(value, joiExtended.phone().mobile());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/\./g, ''));
      });
    });

    describe('with valid mobile phone with numbers space/dashes separated', () => {
      it('success and removes space/dashes', async () => {
        const value = '+1403 306-0485'; // CANADA
        const result = joi.validate(value, joiExtended.phone().mobile());
        chai.expect(result.error).to.equal(null);
        chai.expect(result.value).to.equal(value.replace(/ |-/g, ''));
      });
    });
  });
});
