module.exports = exports = joi => schema => [
  schema,
  joi.object().keys({
    $exists: schema
  })
];
