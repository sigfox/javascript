const { Validator } = require('jsonschema');

/**
 * Describe field to anonymize
 */

const fieldSchema = {
  id: '/field',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    },
    method: {
      type: 'string',
      required: true,
      description: 'Name of the method in chance library to use in order to anonymize'
    },
    args: {
      type: 'object',
      description: 'Arguments to chance method in order to anonymize'
    }
  }
};

/**
 * Describe a collection to anonymize
 */

const collectionSchema = {
  id: '/collection',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    fields: {
      type: 'array',
      items: { $ref: '/field' },
      minItems: 1
    },
    batchSize: {
      type: 'number'
    }
  },
  required: ['name', 'fields']
};

/**
 * Describe a config
 */

const configSchema = {
  id: '/config',
  type: 'object',
  properties: {
    collections: {
      type: 'array',
      items: { $ref: '/collection' },
      minItems: 1
    }
  },
  required: ['collections']
};

const validator = new Validator();
validator.addSchema(fieldSchema, '/field');
validator.addSchema(collectionSchema, '/collection');

module.exports = function validateConfig(config) {
  return validator.validate(config, configSchema);
};
