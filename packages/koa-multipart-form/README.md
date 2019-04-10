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

```javascript
const Koa = require('koa');
const multipartForm = require('koa-multipart-form');

const app = new Koa().use(multipartForm()).listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
