# koa-k8s-probes

Koa middleware mounting customizable probes for **readiness** and **liveness** checks, especially useful in a **Kubernetes runtime context**.

## Features

Mount GET **/liveness** and **/readiness** routes to your Koa application. By default, these routes will always return a `200` HTTP status code.

You can customize each route check by setting the `livenessProbe` or `readinessProbe` attributes when mounting middleware. These custom checks would
have to **return a Promise**. If _resolved_, a `200` HTTP status code will be returned, otherwise it will be a `503`.

## Install

```bash
npm install @sigfox/koa-k8s-probes
```

## Usage

```javascript
const k8sProbes = require('@sigfox/koa-k8s-probes');
const Koa = require('koa');

async function readinessProbe(ctx) {
  const { mongodbClient, redisClient, otherClient } = ctx.services;
  await Promise.all([
    mongodbClient.db.command({ ping: 1 }),
    redisClient.ping(),
    otherClient.someCheck()
  ]);
}

const app = new Koa().use(k8sProbes()); // always return 200 with default configuration
const app = new Koa().use(k8sProbes({ readinessProbe })); // customize readiness route and return 503 when promise is rejected

const server = app.listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
