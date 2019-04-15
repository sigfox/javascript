# joi-phone - Joi extension for phone validation

## This is a fork of [joi-phone-validator](https://github.com/oystparis/joi-phone-validator).

All credits go to the original creators, we forked it in order to export an extension instead of a validator.

## Features

Joi extension for phone number validation.

- [Joi](#joi)
  - [`phone`](#phone)
  - [`mobile`](#mobile)
  - [`validate`](#validate)

## When use it?

This module can be used if you need to extend your Joi instance with a phone/mobile number validator.

## Install

```bash
npm install @sigfox/joi-phone
```

## Usage

#### `phone`

Generates a joi schema that matches any phone number.

#### `mobile`

Joi rule for mobile number matching.

#### `validate`

Joi rule for E.164 international format matching.

```javascript
const joi = require('joi');
const joiPhone = require('@sigfox/joi-phone');

const joiExtended = joi.extend(joiPhone);

const phoneSchema = joiExtended
  .phone()
  .validate();

const mobileSchema = joiExtended
  .phone()
  .mobile();

joiExtended.validate('+33123456789', phoneSchema); // success
joiExtended.validate('0000123456789', phoneSchema); // error

joiExtended.validate('+1403 306-0485', mobileSchema); // success
joiExtended.validate('+33123456789', mobileSchema); // error
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
