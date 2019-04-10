module.exports = exports = joi => (fields = [], defaults = { createdAt: 'asc' }) => {
  const stringOrderRule = joi.string().valid(['asc', 'desc']);
  const rule = joi.object().default(defaults);
  if (fields.length > 0) {
    return rule.keys(
      fields.reduce((schema, field) => {
        schema[field] = stringOrderRule;
        return schema;
      }, {})
    );
  }
  return rule.pattern(/\w\d/, stringOrderRule);
};
