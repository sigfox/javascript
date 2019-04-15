# koa-query-fields

Koa middleware selecting fields from ctx.body depending on ctx.query.fields.

## When use it?

This module can be used if you need to select fields from the response body of a koa request depending on ctx.query.fields

## Features

Select response body fields, the middleware expects to find state.query.fields.

## Install

```bash
npm install @sigfox/koa-query-fields
```

## Usage

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const { asyncGetPublicData } = require('hypothetical-async-getters');
const queryFields = require('@sigfox/koa-query-fields');

const getRoutes = () => {
  const router = new Router();

  router.get('data', queryFields, async ctx => {
    const data = await asyncGetPublicData();
    ctx.body = data;
  });

  return router.routes();
};

const app = new Koa().use(getRoutes()).listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
