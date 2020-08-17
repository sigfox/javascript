# @sigfox/eslint-config

[![npm version](https://badge.fury.io/js/%40sigfox%2Feslint-config.svg)](https://www.npmjs.com/package/@sigfox/eslint-config)

This is the shared Eslint configuration used for javascript projects at [Sigfox](https://www.sigfox.com).

It is meant to be used with Prettier (all rules handled by Prettier are turned off).

> ---
>
> ⚠️ Work in progress
>
> This package is still at its early stages, and radical changes may occur.
>
> ---

## Installation

### Yarn

If you use yarn, run `npm info "@sigfox/eslint-config@latest" peerDependencies` to list the peer dependencies and versions, then run `yarn add --dev <dependency>@<version>` for each listed peer dependency.

### npm 5+

```sh
npx install-peerdeps --dev @sigfox/eslint-config
```

## Usage

Here is our typical `.eslintrc` file:

```json
// .eslintrc
{
  "extends": "@sigfox/eslint-config",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {}
}
```

We use the [babel-eslint](https://github.com/babel/babel-eslint/). It's not mandatory, but if you are using babel (including babel-loader in your webpack or other flavors), you should use this parser to avoid false positives.

## Meant to be used with [Prettier](https://prettier.io/) and [EditorConfig](https://editorconfig.org/)

All rules that are unnecessary or might conflict with Prettier are turned off.

This is the Prettier config we use:

```json
// .prettierrc

{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "proseWrap": "preserve"
}
```

Please refer to the [Prettier documentation](https://prettier.io/docs/en/install.html) to integrate it in your environment and [editor/IDE](https://prettier.io/docs/en/editors.html). Don't forget to consider [prettier-eslint](https://github.com/prettier/prettier-eslint).

This is the EditorConfig config we use:

```
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# http://editorconfig.org

root = true

[*]

# Change these settings to your own preference
indent_style = space
indent_size = 2

# We recommend you to keep these unchanged
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

Please refer to the [EditorConfig documentation](https://editorconfig.org/) to integrate it in your environment.

## Troubeshooting

If you are migrating from a previous eslint version or configuration, or just did an upgrade of this package or dependencies, follow these steps after installation and configuration:

- destroy your node_modules directory
- if you are using yarn, clean its cache: `yarn cache clean`
- `yarn` or `npm install`
- reboot your editor / IDE

## Contributing

Don't hesitate to open issues, submit pull requests, and to start a debate.

Still, you have to keep in mind that this is the configuration we use at Sigfox, and that we might decline change requests because they don't comply with our internal choices, and not because they are stupid.

Feel free to fork, change, rename and pubish your own package based on this one.

## Licence and credits

MIT

Big thanks to Airbnb for publishing their [eslint config packages](https://github.com/airbnb/javascript/tree/master/packages), which we used and tuned for a time before deciding to make our own package. Most of the code here is still simple copy/paste of it.
