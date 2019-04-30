# koa-error-handler

Koa middleware for Error Handling

## When use it?

This module can be used if you need an Error Handler for your Koa App.

## Features

Mount an Error Handler to your Koa app. If an error is caught, this will be the response:
```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An internal server error occurred"
}
```

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

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
