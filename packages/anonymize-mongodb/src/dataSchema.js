/**
 * Describe field to anonymize
 * @type {{id: string, type: string, properties: {name: {type: string, required: boolean}, anonymize: {type: string, required: boolean}, args: {type: string}}}}
 */
const fieldSchema = {
  'id': '/Field',
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      "required": true
    },
    'anonymize': {
      'type': 'string',
      "required": true,
      "description": 'Name of the method in chance library to use in order to anonymize'
    },
    'args': {
      'type': 'object',
      'description': 'Arguments to chance method in order to anonymize'
    }
  }
};

/**
 * Describe a collection to anonymize
 * @type {{id: string, type: string, properties: {name: {type: string}, fields: {type: string, items: {$ref: string}, minItems: number}}, required: string[]}}
 */
const collectionSchema = {
  'id': '/Collection',
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'fields': {
      'type': 'array',
      'items': { '$ref': '/Field' },
      'minItems': 1
    }
  },
  'required': ['name', 'fields']
};

/**
 * Describe a collections to anonymize
 * @type {{id: string, type: string, items: {$ref: string}, minItems: number}}
 */
const collectionsSchema = {
  'id': '/Collections',
  'type': 'array',
  'items': { '$ref': '/Collection' },
  'minItems': 1
};

module.exports = {
  fieldSchema: fieldSchema,
  collectionSchema: collectionSchema,
  collectionsSchema: collectionsSchema
};
