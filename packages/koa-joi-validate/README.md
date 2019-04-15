# koa-joi-validate

[![npm version](https://img.shields.io/npm/v/@sigfox/koa-joi-validate.svg?style=flat)](https://www.npmjs.com/package/@sigfox/koa-joi-validate)
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sigfox/javascript/blob/master/LICENSE)

[Joi](https://github.com/hapijs/joi) validation middleware for [Koa](https://koajs.com) using [Boom](https://github.com/hapijs/boom) to format errors.

## Features

- Allows **easy** and **declarative** validation of request's `body`, `headers`, `params` and `query`
- Uses [Joi](https://github.com/hapijs/joi), a **robust** and **popular** validation library
- Formats errors using [Boom](https://github.com/hapijs/boom) to format errors. together with [@sigfox/koa-boom](https://github.com/sigfox/javascript/tree/master/packages/koa-boom).

## Install

```bash
npm install @sigfox/koa-joi-validate
```

## Usage

**koaJoiValidate(schemasOrFunc, joiValidateOptions)**

- `schemasOrFunc` (`Object | Function`) (`mandatory`)
  - ***Object***: The Joi schemas that will be passed to Joi.validate
  - ***Function***: A custom function taking ctx as a parameter. Use this is you want to build the schema from the context

- `joiValidateOptions` (`Object`) (`default: {}`): Additonal options that will be spread as Joi.validate() options.

```javascript
const Joi = require('joi');
const Koa = require('koa');
const koaJoiValidate = require('@sigfox/koa-joi-validate');

const app = new Koa()
  .use(
    koaJoiValidate({
      body: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string()
      })
    })
  )
  .use(
    koaJoiValidate(ctx => ({
      query: ctx.state.joiSchema
    }))
  )
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
