module.exports = exports = joi => (limit = 30, max = 1000, min = 1) =>
  joi
    .number()
    .default(limit)
    .min(min)
    .max(max);
