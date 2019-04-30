# koa-multipart-form

Koa middleware handling multipart/form-data.

## When use it?

You can use this module if you need your Koa app to parse 'multipart/form-data'.

## Features

Parses requests having type: 'multipart/form-data' and set ctx.body with the parsed stream.

## Install

```bash
npm install @sigfox/koa-multipart-form
```

## Usage

**koaMultipartForm(options)**

- `options` (`Object`) (`default: {}`) You can either decide to pass an object that will be used as options for formidable.IncomingForm or the instance of it directly:
  - ***Object***: The options that will be passed to IncomingForm.
  - ***instance of formidable.IncomingForm***: The instance of IncomingForm that will be used for multipart processing.

```javascript
const Koa = require('koa');
const koaMultipartForm = require('koa-multipart-form');

const app = new Koa().use(koaMultipartForm()).listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
