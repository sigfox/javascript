# koa-health-check

Koa middleware mounting the route GET /health.

## When use it?

You can use this module if you need a route returning the health status of your Koa app.

## Features

Mount GET /health to your Koa app, this route verifies the existence of a field in the Koa's context,
and will set the status to 503 if that field exists, otherwise 200.

## Install

```bash
npm install @sigfox/koa-health-check
```

## Usage

- `fieldToVerify` (`String`) (`default: "isShutdown"`): The name of the field in the ctx that /health will search for, if that field exists and is truthy, a 503 status will be responded.

```javascript
const Koa = require('koa');
const healthCheck = require('@sigfox/koa-health-check');

const HEALTH_CHECK_DELAY = 2000;

const app = new Koa().use(healthCheck());

const server = app.listen();

process.on('SIGTERM', () => {
  app.context.isShutdown = true;
  console.warn(`Received SIGTERM signal, respecting health check delay ${HEALTH_CHECK_DELAY}ms...`);
  setTimeout(() => server.close(), HEALTH_CHECK_DELAY);
});
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
