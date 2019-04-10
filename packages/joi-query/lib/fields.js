module.exports = exports = joi => (fields = []) => {
  let fieldsValid;
  if (fields.length > 0) fieldsValid = joi.string().valid(fields);
  const rule = joi
    .array()
    .items(fieldsValid)
    .default([]);

  return rule;
};
