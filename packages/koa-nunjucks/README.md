# koa-nunjucks

Koa middleware adding ctx.render method allowing you to respond with html pages using [Nunjucks](https://www.npmjs.com/package/nunjucks).

## When use it?

You can use this module if you want your Koa app to render html pages from Nunjucks files.

## Features

Adds the ctx.render method to the Koa context.
It allows you to repond to the client with html pages.

## Install

```bash
npm install @sigfox/koa-nunjucks
```

## Usage

**koaNunjucks(path, globals)**

- `path` (`String`) (`mandatory`): Path to your nunjucks templates.

- `globals` (`Object`) (`default: {}`): Global data that will be available to all templates.

**ctx.render(relPath, locals)**

- `relPath` (`String`) (`mandatory`): Relative path (from global path) to the nunjucks template that you want to render. (ex: "pages/home" will render "global/path/to/your/templates/pages/home.njk")

- `locals` (`Object`) (`default: {}`): Local data that will be available in this template only.

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const koaNunjucks = require('@sigfox/koa-nunjucks');

const getRoutes = () => {
  const router = new Router();

  // This will return the html page generated from the Nunjucks template provided to ctx.render
  router.get('/page', async (ctx) => {
    return ctx.render(
      'templateName',
      // Second parameter is a local value that will be available to this template.
      { specificData: 'toto' }
    )
  });

  return router.routes();
}

const templating = koaNunjucks(
  'path/to/templates',
  // Second parameter is a global value that will be available to all templates.
  {
    user: {
      name: 'foobar'
    },
    something: 'stuff'
  }
);

const app = new Koa()
  .use(templating);
  .use(getRoutes())
  .listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
