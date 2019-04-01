# mongoose-archive - Mongoose plugin adding the method .archive() to your documents schemas

## When use it?

This module can be used if you need to archive some Mongo resources.

## Features

- Adds .archive() method to your schema: set archivedAt: new Date() & isArchived: true.
- Adds .restore() method to your schema: set archivedAt: undefined & isArchived: false.
- On methods .find(), .findOne(), .findOneAndRemove() & .findOneAndUpdate(), archived documents will not be found anymore.

## Install

```bash
npm install @sigfox/mongoose-archive
```

## Usage

Schema declaration

```javascript
const mongoose = require('mongoose');
const mongooseArchive = require('@sigfox/mongoose-archive');

const { Schema, mongo } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true }
});

userSchema.plugin(mongooseArchive);
```

Archive resource

```javascript
const archiveUser = async UserModel => {
  const user = await UserModel.findOne({ email: 'foobar@mail.com' });
  await user.archive();
  ctx.status = 204;
};
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
