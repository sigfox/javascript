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

const app = new Koa().use(promHttpMetrics());
const server = app.listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
