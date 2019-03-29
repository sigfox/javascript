# koa-boom

Koa middleware adding a custom boom method to the context.

## When use it?

You can use this module if you need to use the Sigfox way of formatting errors using [Boom](https://www.npmjs.com/package/boom).

## Features

- Mount a custom boom method to the context. ctx.status & ctx.body are filled by the Boom error content
- A status 400 is considered as a validation error by koa-boom and add the formatted error to ctx.body.validation
- Exports a boom helper that can be used by providing it the context. That can be a great alternative to using the middleware

## Install

```bash
npm install @sigfox/koa-boom
```

## Usage

As a middleware:

```javascript
const Koa = require('koa');
const koaBoom = require('koa-boom');

const app = new Koa()
  .use(koaBoom())
  .use(async ctx => {
    return ctx.boom(boom.badRequest('invalid query'));
  })
  .listen();
```

As a helper:

```javascript
const Koa = require('koa');
const boom = require('boom');
const { boomHelper } = require('koa-boom');

const app = new Koa()
  .use(async ctx => {
    return boomHelper(ctx, boom.badRequest('invalid query'));
  })
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
