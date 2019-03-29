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

```javascript
const Koa = require('koa');
const healthCheck = require('koa-health-check');

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

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
