# koa-error-handler

Koa middleware for Error Handling

## When use it?

This module can be used if you need an Error Handler for your Koa App.

## Features

Mount an Error Handler to your Koa app. If an error is caught, a JSON body will be used as response by default:

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An internal server error occurred"
}
```

If an HTML response is preferred when the "Accept" header is set to prefer HTML response, the middleware
can be configured with html and renderHTML parameters to send an HTML response instead of the default JSON response.

## Install

```bash
npm install @sigfox/koa-error-handler
```

## Usage

**errorHandler({ renderHtml, html })**

- `renderHTML` (`Function`) (`optional`): An asynchronous function returning a Promise resulting to a string representing an HTML page

- `html` (`String`) (`optional`): A string representing an HTML page, used as fallback if renderHTML Promise is rejected or an error is thrown by renderHTML function.

```javascript
const Koa = require('koa');
const errorHandler = require('@sigfox/koa-error-handler');

const html = '<!DOCTYPE html><html lang="en"><body></body></html>';

const app = new Koa()
  .use(
    errorHandler({
      renderHTML: () => Promise.resolve(html),
      html
    })
  )
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
