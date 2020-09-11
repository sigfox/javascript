# koa-nunjucks

Koa middleware adding ctx.render method allowing you to respond with html pages using [Nunjucks](https://www.npmjs.com/package/nunjucks).

## When use it?

You can use this module if you want your Koa app to render html pages from Nunjucks files.

## Features

Adds the ctx.render, ctx.renderTemplate and ctx.renderString methods to the Koa context.
It allows you to respond to the client with html pages using Nunjucks.

## Install

```bash
npm install @sigfox/koa-nunjucks
```

## Usage

**koaNunjucks(path, globals)**

- `path` (`String`) (`mandatory`): Path to your nunjucks templates.

- `globals` (`Object`) (`default: {}`): Global data that will be available to all templates.

**ctx.render(relPath, locals)** - render the given template and set it into ctx.body of Koa app.

- `relPath` (`String`) (`mandatory`): Relative path (from global path) to the nunjucks template that you want to render. (ex: "pages/home" will render "global/path/to/your/templates/pages/home.njk")

- `locals` (`Object`) (`default: {}`): Local data that will be available in this template only.

**ctx.renderTemplate(relPath, locals)** - render the given template

- `relPath` (`String`) (`mandatory`): Relative path (from global path) to the nunjucks template that you want to render. (ex: "pages/home" will render "global/path/to/your/templates/pages/home.njk")

- `locals` (`Object`) (`default: {}`): Local data that will be available in this template only.

**returns:**

- `html` (`Promise`): Resulting html generated after running the template

**ctx.renderString(str, locals)** - render the given raw string

- `str` (`String`) (`mandatory`): Raw string to render

- `locals` (`Object`) (`default: {}`): Local data that will be available in the raw string only.

**returns:**

- `html` (`Promise`): Resulting html generated after rendering the raw string

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

  // This will return the html page generated from the Nunjucks template provided to ctx.renderTemplate
  router.get('/page/template', async (ctx) => {
    const html = await ctx.renderTemplate(
      'templateName'
    );
    ctx.body = html;
  });

  // This will return the html page generated from the Nunjucks template provided to ctx.renderString
  router.get('/page/string', async (ctx) => {
    const html = await ctx.renderString(
      'Hello {{ username }}',
      { username: 'Charlie' }
    );
    ctx.body = html;
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
