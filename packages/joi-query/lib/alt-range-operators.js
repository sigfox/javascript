module.exports = exports = joi => schema => [
  schema,
  joi.object().keys({
    $lt: schema,
    $gt: schema,
    $lte: schema,
    $gte: schema
  })
];
