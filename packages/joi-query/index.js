const filter = require('./lib/filter');
const order = require('./lib/order');
const limit = require('./lib/limit');
const offset = require('./lib/offset');
const fields = require('./lib/fields');
const embed = require('./lib/embed');
const boolOperators = require('./lib/bool-operators');
const altInOperator = require('./lib/alt-in-operator');
const altRangeOperators = require('./lib/alt-range-operators');
const altExistsOperator = require('./lib/alt-exists-operator');
const andOperator = require('./lib/and-operator');
const orOperator = require('./lib/or-operator');

module.exports = exports = (joi) => {
  joi.queryFilter = filter(joi);
  joi.queryOrder = order(joi);
  joi.queryLimit = limit(joi);
  joi.queryOffset = offset(joi);
  joi.queryFields = fields(joi);
  joi.queryEmbed = embed(joi);
  joi.queryBoolOperators = boolOperators(joi);
  joi.queryAltInOperator = altInOperator(joi);
  joi.queryAltRangeOperators = altRangeOperators(joi);
  joi.queryAndOperator = andOperator(joi);
  joi.queryOrOperator = orOperator(joi);
  joi.queryAltExistsOperator = altExistsOperator(joi);
};
