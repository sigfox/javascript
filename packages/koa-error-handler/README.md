# koa-error-handler

Koa middleware handling errors.

## When use it?

This module can be used if you need an Error Handler for your Koa App.

## Features

Mount an Error Handler to your Koa app.

## Install

```bash
npm install @sigfox/koa-error-handler
```

## Usage

```javascript
const Koa = require('koa');
const errorHandler = require('@sigfox/koa-error-handler');

const app = new Koa().use(errorHandler()).listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
