# koa-prometheus

Koa middleware exposing **Prometheus metrics**.

## Features

Mount route providing **metrics** formatted for **Prometheus**, as _text_ or _JSON_. Metrics _collection interval_ is **customizable**, as well as the _endpoint URL_ and metric attribute name _prefix_.

## Install

```bash
npm install @sigfox/koa-prometheus
```

## Usage

```javascript
const prometheus = require('@sigfox/koa-prometheus');
const Koa = require('koa');

const app = new Koa().use(prometheus());
const server = app.listen();
```

## Response format

Default response format is **Prometheus-formatted** text.

To receive it as a **JSON-formatted** response, set request's _Accept_ header to **application/json**.

## Configuration

|          |  Type  | Default  | Description                                 |
| -------- | :----: | :------: | ------------------------------------------- |
| interval | number |  10000   | The interval at which metrics are collected |
| prefix   | string |   none   | Prefix to add to each metric attribute name |
| url      | string | /metrics | API endpoint URL configuration              |

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
