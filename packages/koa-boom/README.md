# koa-boom

Koa middleware adding a custom boom method to the context.

## When use it?

You can use this module if you need to use the Sigfox way of formatting errors using [Boom](https://www.npmjs.com/package/boom).

## Features

- Mount a custom boom method to the context. ctx.status & ctx.body are filled by the Boom error content
- Exports a boom helper that can be used by providing it the context. That can be a great alternative to using the middleware
- Accepts a custom function taking the koa context as a parameter, it allows you to define when a validation error should be returned depending on the context.
- By default, a status 400 is considered as a validation error by koa-boom and add the formatted error to ctx.body.validation

## Install

```bash
npm install @sigfox/koa-boom
```

## Usage

### As a middleware:

```javascript
const Koa = require('koa');
const koaBoom = require('@sigfox/koa-boom');

const app = new Koa()
  .use(koaBoom())
  .use(async ctx => {
    return ctx.boom(boom.badRequest('invalid query'));
  })
  .listen();
// it will set the body with:
// {
//   statusCode: 400,
//   error: 'Bad Request',
//   message: 'invalid query'
// }

app.use(async ctx => {
  return ctx.boom(boom.badRequest('device does not exist', 'message.deviceId'));
});
// it will set the body with:
// {
//   statusCode: 400,
//   error: 'Bad Request',
//   message: 'device does not exist',
//   validation: [{
//    message: 'device does not exist',
//    path: 'message.deviceId',
//    type: 'custom',
//    context: { key: 'deviceId' }
//   }]
// }

app.use(async ctx => {
  return ctx.boom(
    boom.badRequest('device does not exist', {
      field: 'message.deviceId',
      type: 'unknown',
      value: 'XXXX'
    })
  );
});
// it will set the body with:
// {
//   statusCode: 400,
//   error: 'Bad Request',
//   message: 'device does not exist',
//   validation: [{
//    message: 'device does not exist',
//    path: 'message.deviceId',
//    type: 'unknown',
//    context: { key: 'deviceId', value: 'XXXX' }
//   }]
// }

app.use(async ctx => {
  return ctx.boom(
    boom.badRequest('device does not exist', [
      {
        message: 'device does not exist',
        path: 'message.deviceId',
        type: 'unknown',
        context: { key: 'deviceId', value: 'XXXX' }
      }
    ])
  );
});
// it will set the body with:
// {
//   statusCode: 400,
//   error: 'Bad Request',
//   message: 'device does not exist',
//   validation: [{
//    message: 'device does not exist',
//    path: 'message.deviceId',
//    type: 'unknown',
//    context: { key: 'deviceId', value: 'XXXX' }
//   }]
// }
```

#### with custom validation

```javascript
const Koa = require('koa');
const koaBoom = require('@sigfox/koa-boom');

const isValidationError = (ctx) => !![400, 423].includes(ctx.status);

const app = new Koa()
  .use(koaBoom(isValidationError)
  .use(async ctx => {
    return ctx.boom(boom.badData('invalid query'));
  })
  .listen();
// it will set the body with:
// {
//   statusCode: 422,
//   error: 'Unprocessable Entity',
//   message: 'invalid query'
// }
```

### As a helper:

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

#### with custom validation

```javascript
const Koa = require('koa');
const boom = require('boom');
const { boomHelper } = require('koa-boom');

const isValidationError = ctx => !![400, 423].includes(ctx.status);

const app = new Koa()
  .use(async ctx => {
    return boomHelper(ctx, boom.badData('invalid query'), isValidationError);
  })
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
