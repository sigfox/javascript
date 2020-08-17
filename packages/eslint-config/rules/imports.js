module.exports = {
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  plugins: ["import"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".json"]
      }
    },
    "import/extensions": [".js", ".jsx"],
    "import/core-modules": [],
    "import/ignore": [
      "node_modules",
      "\\.(scss|css|png|jpg|jpeg|gif|svg|json)$"
    ]
  },
  rules: {
    // check default exported on default import
    "import/default": "error",

    // we dont care about webpack chunk names right now
    // 'dynamic-import-chunkname': 'off',

    // no nonsense in exports (multiple defaults, etc...)
    "import/export": "error",

    // don't force exports to be last things in a file
    // 'import/exports-last': 'off',

    // explicit import file extension only on non-js files
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        json: "always"
      }
    ],

    // all imports must be first in the file
    "import/first": "error",

    // no need to group exports
    // 'import/group-exports': 'off',

    // no max dependencies
    // 'import/max-dependencies': 'off',

    // be sure to import only existing named exports
    "import/named": "error",

    // also check named exports on namespace imports
    "import/namespace": "error",

    // new line after last import
    "import/newline-after-import": "error",

    // no absolute path (starting with /)
    "import/no-absolute-path": "error",

    // no amd modules
    "import/no-amd": "error",

    // default export can't be anonymous
    "import/no-anonymous-default-export": "error",

    // no commonjs
    // disable this rule locally on special cases (like transpiler setup file)
    // "import/no-commonjs": "error",

    // no cyclical dependencies between modules
    "import/no-cycle": ["warn", { maxDepth: Infinity }],

    // default exports are perfectly fine
    // 'no-default-export': 'off',

    // detect deprecated imports (warn for now, as this rule is a WIP and might behave erratically)
    "import/no-deprecated": "warn",

    // avoid duplicated imports
    "import/no-duplicates": "error",

    // no require() calls with expressions. You shouldn't require() anyway
    "import/no-dynamic-require": "error",

    // declare all imported packages as explicit project dependencies
    "import/no-extraneous-dependencies": "error",

    // internal/relative module importing is fine in some cases,
    // needs a Best Practices rule not a eslint one
    // 'import/no-internal-modules': 'off'

    // don't export stuff declared as var or let
    "import/no-mutable-exports": "error",

    // TODO analyze this one
    // import/no-named-as-default-member

    // check that you don't try to import a named export as a default
    "import/no-named-as-default": "error",

    // check that you don't try to import a default export as a named
    "import/no-named-default": "error",

    // namespace imports are ok
    // 'import/no-namespace': 'off',

    // nodejs modules are perfectly fine
    // 'import/no-nodejs-modules': 'off'

    // TODO analyze
    // no-relative-parent-imports

    // TODO put this one in boilerplate
    // import/no-restricted-paths

    // don't import yourself
    "import/no-self-import": "error",

    // disallow unassigned imports (excepts for babel-loader stuff)
    "import/no-unassigned-import": [
      "error",
      {
        allow: [
          "**/*.css",
          "**/*.scss",
          "**/*.svg",
          "**/*.png",
          "**/*.jpg",
          "**/*.jpeg",
          "**/*.gif"
        ]
      }
    ],

    // check that you import things that exists
    "import/no-unresolved": ["error", { commonjs: true }],

    // don't be stupid with your paths
    "import/no-useless-path-segments": "error",

    // don't use webpack loader syntax (loader!./import.css)
    "import/no-webpack-loader-syntax": "error",

    // TODO to debate
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "ignore"
      }
    ]

    // you can do a single named export, if it's not against our best practices
    // 'import/prefer-default-export': 'off',

    // TODO check this one
    // import/unambiguous
  }
};
