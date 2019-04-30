module.exports = exports = joi => (schema, max = 100, min = 1) => [
  schema,
  joi.object().keys({
    $in: joi
      .array()
      .items(schema)
      .min(min)
      .max(max)
  })
];
