# koa-k8s-ops-app

Instantiates a **Koa app** with default **OPS middlewares**.

## Features

Creates an OPS-specific Koa application with already mounted middlewares.

## Install

```bash
npm install @sigfox/koa-k8s-ops-app
```

## Usage

```javascript
const KoaOps = require('@sigfox/koa-k8s-ops-app');

const app = new KoaOps();
const server = app.listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
