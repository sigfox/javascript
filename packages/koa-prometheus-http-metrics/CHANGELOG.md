# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/sigfox/javascript/compare/@sigfox/koa-prometheus-http-metrics@1.2.0...@sigfox/koa-prometheus-http-metrics@2.0.0) (2020-08-21)


### Features

* **koa-prometheus-http-metrics:** add http_requests_total metric to collect total number of http requests ([57a7126](https://github.com/sigfox/javascript/commit/57a7126))


### BREAKING CHANGES

* **koa-prometheus-http-metrics:** remove the possibility to change `labelNames` of the histogram metric `http_request_duration_ms`, before changing these values would actually break the correct behavior and with a new metric `http_requests_total`. Also, remove the possibility to change `name` and `help` of the histogram metric `http_request_duration_ms` since now two metrics are collected with different `name` and `help` values.





# [1.2.0](https://github.com/sigfox/javascript/compare/@sigfox/koa-prometheus-http-metrics@1.1.1...@sigfox/koa-prometheus-http-metrics@1.2.0) (2020-07-23)


### Features

* use ctx.routerPath over ctx.path and add filter option ([932a2bb](https://github.com/sigfox/javascript/commit/932a2bb))





## [1.1.1](https://github.com/sigfox/javascript/compare/@sigfox/koa-prometheus-http-metrics@1.1.0...@sigfox/koa-prometheus-http-metrics@1.1.1) (2019-06-17)


### Bug Fixes

* **koa-prometheus-http-metrics:** add default options when destructuring ([#6](https://github.com/sigfox/javascript/issues/6)) ([3321ebe](https://github.com/sigfox/javascript/commit/3321ebe))





# 1.1.0 (2019-06-17)


### Features

* **koa-prometheus-http-metrics:** add Prometheus HTTP metrics package ([0001c06](https://github.com/sigfox/javascript/commit/0001c06))
