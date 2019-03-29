# koa-joi-validate

[![npm version](https://img.shields.io/npm/v/@sigfox/koa-joi-validate.svg?style=flat)](https://www.npmjs.com/package/@sigfox/koa-joi-validate)
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE)

[Joi](https://github.com/hapijs/joi) validation middleware for [Koa](https://koajs.com) using [Boom](https://github.com/hapijs/boom) to format errors.

## Features

- Allows **easy** and **declarative** validation of request's `body`, `headers`, `params` and `query`
- Uses **Joi**, a **robust** and **popular** validation library
- Formats errors using **Boom**

## Install

```bash
npm install @sigfox/koa-joi-validate
```

## Usage

```javascript
const Joi = require('joi');
const Koa = require('koa');
const koaJoiValidate = require('koa-joi-validate');

const app = new Koa()
  .use(
    koaJoiValidate({
      body: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string()
      })
    })
  )
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
