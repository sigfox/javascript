const JSONStream = require('JSONStream');
const csvStringify = require('csv-stringify');
const es = require('event-stream');
const get = require('lodash.get');
const { ObjectId } = require('mongoose').mongo;

/**
 * Helpers CSV serializers
 */

// eslint-disable-next-line no-use-before-define
const serializeArrayForCSV = value => value.map(item => serializeValueForCSV(item)).join(',');

const serializeObjectForCSV = (value) => {
  const preSerializedObject = Object.keys(value).reduce((object, key) => {
    // eslint-disable-next-line no-use-before-define
    object[key] = serializeValueForCSV(value[key]);
    return object;
  }, {});
  return JSON.stringify(preSerializedObject);
};

const serializeValueForCSV = (value) => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return serializeArrayForCSV(value);
  if (value instanceof Date) return value.toISOString();
  if (value instanceof ObjectId) return value.toHexString();
  if (typeof value === 'object') return serializeObjectForCSV(value);
  return value.toString();
};

/**
 * Mongoose model stream export middleware
 */

module.exports = Model => async (ctx) => {
  let choosenFields = Model.EXPORT_FIELDS;
  const isCSV = ctx.request.type === 'text/csv' || ctx.query.format === 'csv';
  const csvOptions = {
    delimiter: ';',
    header: true,
    escape: '\\',
    quoted: true,
    quotedEmpty: true
  };
  const serializeStream = isCSV ? csvStringify(csvOptions) : JSONStream.stringify();

  const onError = err => console.error(err);

  Model.find({})
    .cursor()
    .on('error', onError)
    .pipe(
      es.mapSync((document) => {
        let data = document.toJSON();
        if (Model.transformForExport) {
          data = Model.transformForExport(data);
        }
        if (!choosenFields) {
          choosenFields = Object.keys(Model.schema.obj).concat(Object.keys(Model.schema.virtuals));
          if (Model.schema.options.timestamps) {
            choosenFields = choosenFields.concat(['createdAt', 'updatedAt']);
          }
          if (!data._id) choosenFields = choosenFields.filter(field => field !== '_id');
          choosenFields.sort((fieldA, fieldB) => {
            const isId = field => field === '_id' || field === 'id';
            if (isId(fieldA)) return -1;
            if (isId(fieldB)) return 1;
            return fieldA > fieldB ? 1 : -1;
          });
        }
        data = choosenFields.reduce((result, field) => {
          if (isCSV) {
            result[field] = serializeValueForCSV(get(data, field, ''));
          } else {
            result[field] = get(data, field);
          }
          return result;
        }, {});
        return data;
      })
    )
    .on('error', onError)
    .pipe(serializeStream)
    .on('error', onError);

  ctx.body = serializeStream;
  const extension = isCSV ? 'csv' : 'json';
  ctx.set('Content-Disposition', `attachement; filename=${Model.collection.name}.${extension}`);
  const contentType = isCSV ? 'text/csv' : 'application/json';
  ctx.set('Content-Type', `${contentType}; charset=utf-8`);
  ctx.status = 200;
};
