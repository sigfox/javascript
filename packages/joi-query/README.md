# joi-query - Joi helpers for url query validation

## Features

- [Joi](https://github.com/hapijs/joi)
  - [`queryFilter`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/filter.js)
  - [`queryOrder`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/order.js)
  - [`queryLimit`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/limit.js)
  - [`queryOffset`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/offset.js)
  - [`queryFields`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/fields.js)
  - [`queryEmbed`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/embed.js)
  - [`queryBoolOperators`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/bool-operators.js)
  - [`queryAltInOperator`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/alt-in-operator.js)
  - [`queryAltRangeOperators`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/alt-range-operators.js)
  - [`queryAndOperator`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/alt-operator.js)
  - [`queryOrOperator`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/or-operator.js)
  - [`queryAltExistsOperator`](https://gitlab.partners.sigfox.com/sigfox/flive-app/tree/master/packages/joi-query/lib/alt-exists-operator.js)

## When use it?

This module can be used if you need to validate url queries using Joi

## Install

```bash
npm install @sigfox/joi-query
```

## Usage

```javascript
const joi = require('joi');

// This adds the helpers to the joi instance
require('./joi-query')(joi);
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
