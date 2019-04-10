# joi-phone - Joi extension for phone validation

## This is a fork of [joi-phone-validator](https://github.com/oystparis/joi-phone-validator).

All credits go to the original creators, we forked it in order to export an extension instead of a validator.

## Features

Joi extension for phone number validation.

- [Joi](#joi)
  - [`phone`](#phone)
  - [`mobile`](#mobile)
  - [`validate`](#validate)

#### `phone`

Generates a schema object that matches any phone number

#### `mobile`

Generates a schema object that matches any mobile phone number

#### `validate`

Validates a value using the schema

## When use it?

This module can be used if you need to validate a phone number using Joi.

## Install

```bash
npm install @sigfox/joi-phone
```

## Usage

```javascript
const joi = require('joi');
const joiPhone = require('@sigfox/joi-phone');

const joiExtended = joi.extend(joiPhone);

const phoneValidation = joiExtended
  .phone()
  .mobile()
  .validate();
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://gitlab.partners.sigfox.com/sigfox/flive-app/blob/master/LICENSE) file for details.
