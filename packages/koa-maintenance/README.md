# koa-maintenance

Koa middleware to manage maintenance mode.

## When use it?

You can use this module if you need to manage the maintenance mode of your Koa app.

## Features

Switch on or off at startup the maintenance mode of your Koa app, if on it will send a 503 status to all incoming requests, if off it will go through the maintenance middleware without modifications of the incoming request. The HTTP status code and the body's response can be customised via the `options` parameter.

## Install

```bash
npm install @sigfox/koa-maintenance
```

## Usage

- `isOn` (`Boolean`) (`default: "false"`): The flag to indicate if the maintenance is on or off, default is off.
- `options` (`Object`) (`default`: "{ status: 503, message: "We are currently down for maintenance." }"): The options to customise status code and body's response.

```javascript
const Koa = require('koa');
const maintenance = require('@sigfox/koa-maintenance');

const app = new Koa();
app.use(
  maintenance(process.env.MAINTENANCE === 'true', {
    status: 503,
    message: 'Something amazing is coming, bear with us'
  })
);

const server = app.listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
