# koa-acl

Koa middleware for ACL handling.

## When use it?

This module can be used if you need to handle authorizations on your koa app.

## Features

- Returns boom error if the user doesn't have the right roles.

## Install

```bash
npm install @sigfox/koa-acl
```

## Usage

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const aclMiddleware = require('koa-acl');
const controller = require('hypothetical-controller');

const ADMIN_ROLE = 'admin';

// ctx.state must be populated by user or roles
const addUser = (ctx, next) => {
  // Both of those are working, user.roles has priority though.
  ctx.state.user = {
    roles: [ADMIN_ROLE]
  };
  ctx.state.roles = [ADMIN_ROLE];
  return next();
};

const addAdmin = (ctx, next) => {
  ctx.state.user = {
    isAdmin: true
  };
  return next();
};

// Just provide the roles that can go through
const adminAuthorizations = aclMiddleware({
  roles: [ADMIN_ROLE]
});

// It can also be used this way
const isAdmin = aclMiddleware({
  query: ctx => !!(ctx.state.user && ctx.state.user.isAdmin)
});

const getRoutes = () => {
  const router = new Router();

  // This will reach the controller
  router.get('data/1', controller);

  // This will reach the controller
  router.get('data/2', addUser, adminAuthorizations, controller);

  // This will return 403 because no user is provided
  router.get('data/3', adminAuthorizations, controller);

  // This will return 403 because no user is provided
  router.get('data/4', isAdmin, controller);

  // This will reach the controller
  router.get('data/5', addAdmin, isAdmin, controller);

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
