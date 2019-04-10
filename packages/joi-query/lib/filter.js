module.exports = exports = joi => schema =>
  joi
    .object()
    .keys(schema)
    .default({});
