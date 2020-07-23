# koa-prometheus-http-metrics

Koa middleware registering **Prometheus HTTP metrics**.

## Features

Mount a middleware that registers **HTTP metrics** in the _prom-client_ singleton and then can be easily exposed with the _@sigfox/koa-prometheus_ package.

## Install

```bash
npm install @sigfox/koa-prometheus-http-metrics
```

## Usage

```javascript
const promHttpMetrics = require('@sigfox/koa-prometheus-http-metrics');
const Koa = require('koa');

const app = new Koa().use(
  promHttpMetrics({
    filter: path => !path.includes('/admin') // remove admin routes from prometheus monitoring
  })
);
const server = app.listen();
```

By default the label used is the `ctx.path` given by Koa, if `@koa-router` is used `ctx.routerPath` will be used to group requests going to the same route. For example GET /users/1 and GET /users/2 requests matching the route /users/:id will be grouped using the label `/users/:id`.

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
