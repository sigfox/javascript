# koa-visibility

Koa middleware hiding fields from ctx.body depending on user roles.

## When use it?

This module can be used if you need to hide fields from the response body of a koa request depending of the role of the user requesting.

## Features

Hide response body fields, the middleware expects to find state.user.roles or state.roles

## Install

```bash
npm install @sigfox/koa-visibility
```

## Usage

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const visibility = require('koa-visibility');
const { asyncGetUsers, asyncGetPublicData } = require('hypothetical-async-getters');

const PUBLIC_FIELDS = ['firstname', 'lastname'];
const USER_FIELDS = ['company', 'email'];
const ADMIN_FIELDS = ['phoneNumber', 'address'];

// ctx.state must be populated by user or roles
const addUser = (ctx, next) => {
  // Both of those are working, user.roles has priority though.
  ctx.state.user = {
    roles: ['admin']
  };
  ctx.state.roles = ['admin'];
  return next();
};

const visibilityMiddleware = visibility({
  public: PUBLIC_FIELDS,
  user: [...PUBLIC_FIELDS, ...USER_FIELDS],
  admin: [...PUBLIC_FIELDS, ...USER_FIELDS, ...ADMIN_FIELDS]
});

const getRoutes = () => {
  const router = new Router();

  // No visibility here since data is already public
  router.get('/users', addUser, visibilityMiddleware, async ctx => {
    const users = await asyncGetUsers();
    ctx.body = users;
  });

  // No visibility here since data is already public
  router.get('/data', async ctx => {
    const data = await asyncGetPublicData();
    ctx.body = data;
  });

  return router.routes();
};

const app = new Koa().use(getRoutes()).listen();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
