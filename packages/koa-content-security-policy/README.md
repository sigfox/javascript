# koa-content-security-policy

Koa middleware adding `ctx.templateSecurityMethods` methods and `ctx.setContentSecurityPolicy` method, allowing you to define content security policy.

## When use it?

You can use this module if you want to define the front security rules.

## Features

Adds the `ctx.setContentSecurityPolicy` and `ctx.templateSecurityMethods` to the Koa context.

- `ctx.templateSecurityMethods` contains the methods to adapt the html template to the constraints of the security policy.
- `ctx.setContentSecurityPolicy` is used to apply the security policy defined in the application.

## Install

```bash
npm install @sigfox/koa-content-security-policy
```

## Usage

**koaContentSecurityPolicy({ scriptSrc, styleSrc, fontSrc, frameAncestors })**

- `scriptSrc` (`Array`) (`default: []`): List of security rules to control the use of javascript [more details](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
- `styleSrc` (`Array`) (`default: []`): List of security rules to be applied to styles [more details](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src).
- `fontSrc` (`Array`) (`default: []`): List of security rules to be applied to fonts [more details](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src).
- `frameAncestors` (`Array`) (`default: []`): List of security settings to control the use of the application in the context of an iframe [more details](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors).

**ctx.templateSecurityMethods { computeJsNonce() }**

`templateSecurityMethods` is defined to be used by the template generator to adapt the html markup to security constraints.

For these methods to be applied correctly, the html rendering must be done before the security constraints are set.

- `computeJsNonce` Automatically define random nonces which will then be automatically defined in script-src policy ['see nonce-<base64-value>'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).

**ctx.setContentSecurityPolicy({ scriptSrc, styleSrc, fontSrc, frameAncestors })**

By default `setContentSecurityPolicy` will apply the configuration defined in the project.
You can use the `scriptSrc`, `styleSrc`, `fontSrc` and `frameAncestors` properties to extend the configuration.
