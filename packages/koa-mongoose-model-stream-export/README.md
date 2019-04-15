# koa-mongoose-model-stream-export

Koa middleware mounting routes in order to export Mongoose schema to CSV/JSON.

## When use it?

This module can be used if you need a route returning the schema of a Mongoose Model using CSV or JSON format.

## Features

- Formats a mongoose Model to CSV/JSON and adds it to Koa's context.
- Select the fields you want in the export adding EXPORT_FIELDS to the Model.
- Tranforms the data by adding the method .transformForExport() to the model.

## Install

```bash
npm install @sigfox/koa-mongoose-model-stream-export
```

## Usage

```javascript
const Koa = require('koa');
const mongoose = require('mongoose');
const Router = require('koa-router');
const mongooseModelStreamExport = require('@sigfox/koa-mongoose-model-stream-export');

const { Company, User } = require('./hypothetical-models');

// EXPORT_FIELDS can be defined in the model if you want to specify the fields to export
// Warning: Those are the fields that will be in the CSV, all the other fields will be removed
Company.statics.EXPORT_FIELDS = ['name', 'email', 'phoneNumber'];
// transformForExport can be defined in the model if you want to transform the data before formatting it for export
User.statics.transformForExport = user => ({
  name: `${user.firstname} ${user.lastname}`,
  email: user.email
});

const getRoutes = () => {
  const router = new Router();

  router.get('company-schema', mongooseModelStreamExport(Company));
  router.get('user-schema', mongooseModelStreamExport(User));

  return router.routes();
};

const app = new Koa().use(getRoutes()).listen();
```

### Options

- JSON (default)

- CSV: If you want the route to return the data using CSV format, you can set `Content-Type=text/csv` or add ?format=csv in the request's query.

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
