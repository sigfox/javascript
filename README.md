# flive-app

## Packages

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| Package | Version | Docs | Description |
|---------|---------|------|-------------|
| [flive-app-redux-helpers](packages/flive-app-redux-helpers) | [![npm](https://img.shields.io/npm/v/flive-app-redux-helpers.svg?style=flat-square)](https://www.npmjs.com/package/flive-app-redux-helpers) | [README](packages/flive-app-redux-helpers/README.md) | redux action / reducer generators and other redux helpers |
| [flive-app-router-transitions-middleware](packages/flive-app-router-transitions-middleware) | [![npm](https://img.shields.io/npm/v/flive-app-router-transitions-middleware.svg?style=flat-square)](https://www.npmjs.com/package/flive-app-router-transitions-middleware) | [README](packages/flive-app-router-transitions-middleware/README.md) | redux middleware for launching promises before page component initialisations (universal) |
| [flive-app-api-middleware](packages/flive-app-api-middleware) | [![npm](https://img.shields.io/npm/v/flive-app-api-middleware.svg?style=flat-square)](https://www.npmjs.com/package/flive-app-api-middleware) | [README](packages/flive-app-api-middleware/README.md) | redux middleware for transforming actions into api calls (universal) |
| [flive-app-api-client](packages/flive-app-api-client) | [![npm](https://img.shields.io/npm/v/flive-app-api-client.svg?style=flat-square)](https://www.npmjs.com/package/flive-app-api-client) | [README](packages/flive-app-api-client/README.md) | axios wrapper for flive-app |