module.exports = {
  plugins: ['react', 'react-hooks'],

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },

  // View link below for react rules documentation
  // https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
  rules: {
    // use double quotes in jsx
    'jsx-quotes': ['error', 'prefer-double'],

    // if a class method doesn't use 'this', you can make it a static method
    'class-methods-use-this': [
      'warn',
      {
        exceptMethods: [
          'render',
          'getInitialState',
          'getDefaultProps',
          'getChildContext',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch'
        ]
      }
    ],

    // enforce isBool or hasBool
    'react/boolean-prop-naming': 'error',

    // buttons must have an explicit type
    'react/button-has-type': 'error',

    // enforce propTypes and defaultProps
    'react/default-props-match-prop-types': 'error',

    // enforce destructuring assignements on props, state and context
    'react/destructuring-assignment': 'warn',

    // no need to use displayName
    // 'react/display-name': 'off',

    // warn on style prop usage
    'react/forbid-component-props': [
      'warn',
      {
        forbid: ['style']
      }
    ],

    // no DOM node props restrictions
    // 'react/forbid-dom-props': 'off',

    // no forbidden elements
    // 'react/forbid-elements': 'off',

    // forbid using imported propTypes
    'react/forbid-foreign-prop-types': 'warn',

    // forbid "any" propType
    // TODO maybe array too (use arrayOf) ?
    'react/forbid-prop-types': ['error', { forbid: ['any'] }],

    // prevent accessing state in setState
    'react/no-access-state-in-setstate': 'error',

    // prevent usage of Array index in keys
    'react/no-array-index-key': 'error',

    // don't pass children as prop
    'react/no-children-prop': 'warn',

    // don't use both dangerouslySetInnerHTML and children
    'react/no-danger-with-children': 'error',

    // warn on using dangerouslySetInnerHTML
    'react/no-danger': 'warn',

    // forbid deprecated methods
    'react/no-deprecated': 'error',

    // allow setState in componentDidMount (needed for SSR)
    // TODO document that it must only be used for SSR issues
    // 'react/no-did-mount-set-state': 'off',

    // warn using setState on componentDidUpdate (can lead to looping shit)
    'react/no-did-update-set-state': 'warn',

    // don't direclty mutate the state
    'react/no-direct-mutation-state': 'error',

    // don't use findDOMNode (perf issues, will be deprecated, use refs instead)
    // https://github.com/yannickcr/eslint-plugin-react/issues/678#issue-165177220
    'react/no-find-dom-node': 'error',

    // don't use isMounted, anti-pattern, will be deprecated
    // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    'react/no-is-mounted': 'error',

    // only one component per file
    'react/no-multi-comp': 'error',

    // don't use shouldComponentUpdate in PureComponent
    'react/no-redundant-should-component-update': 'error',

    // Don't be stupid with ReactDOM.render()
    'react/no-render-return-value': 'error',

    // Of course you can use setState, if absolutely need a state
    // 'react/no-set-state': 'off'

    // Don't use string refs
    'react/no-string-refs': 'error',

    // No 'this' in functional components.
    // But don't use functional components anyway, until react actually optimizes them.
    'react/no-this-in-sfc': 'error',

    // Prevent casing typos on common React class props and methods,
    'react/no-typos': 'error',

    // TODO  warn on unescaped entities ?
    // 'react/no-unescaped-entities': 'warn'

    // camelCase your DOM properties
    'react/no-unknown-property': 'error',

    // hey, clean-up your unused propTypes
    // TODO they can be false positives https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
    'react/no-unused-prop-types': 'error',

    // and clean up your state. (or don't use state, at all)
    'react/no-unused-state': 'error',

    // don't setState on componentWillUpdate
    'react/no-will-update-set-state': 'error',

    // use ES6 classes
    'react/prefer-es6-class': ['error', 'always'],

    // prefer stateless functions
    'react/prefer-stateless-function': ['warn'],

    // validate your propTypes
    'react/prop-types': [2, { ignore: ['children', 'className'] }],

    // you must import React if you use JSX
    'react/react-in-jsx-scope': 'error',

    // you must declare default prop value if (nad olny if) it's not a required prop
    'react/require-default-props': [
      'error',
      { forbidDefaultForRequired: true }
    ],

    // don't enforce shouldComponentUpdate
    // "react/require-optimization": "error",

    // return something in render()
    'react/require-render-return': 'error',

    // empty tags are self-closing
    'react/self-closing-comp': 'error',

    // sort component methods and props
    // TODO review
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-methods',
          'props-validation',
          'constructor',
          'instance-variables',
          'lifecycle',
          '/^on.+$/', // delegated handlers
          '/^handle.+$/', // internal handlers
          'getters',
          'setters',
          '/^(get|set).+$/',
          'instance-methods',
          'everything-else',
          'rendering'
        ],
        groups: {
          constructor: ['constructor'],
          lifecycle: [
            'getDerivedStateFromProps',
            'getSnapshotBeforeUpdate',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount'
          ],
          'props-validation': ['propTypes', 'defaultProps'],
          rendering: ['/^render.+$/', 'render']
        }
      }
    ],

    // sort your propTypes
    'react/sort-prop-types': [
      'warn',
      {
        ignoreCase: true,
        callbacksLast: true,
        requiredFirst: true,
        sortShapeProp: true
      }
    ],

    // styles prop must be an object. But don't use styles prop
    'react/style-prop-object': 'error',

    // prevent children on void DOM elements,
    'react/void-dom-elements-no-children': 'error',

    /********************************
     *
     *            JSX
     *
     ********************************/

    // omit {true} on boolean attributes
    'react/jsx-boolean-value': 'error',

    // warn on possible spacing issues
    'react/jsx-child-element-spacing': 'warn',

    // align closing bracket aligned with opening
    // PRETTIER ?
    'react/jsx-closing-bracket-location': 'error',

    // align closing tag
    // PRETTIER ?
    'react/jsx-closing-tag-location': 'error',

    // unnecessary curly braces
    'react/jsx-curly-brace-presence': ['error', 'never'],

    // no curly braces spacing in attributes
    'react/jsx-curly-spacing': ['error', 'never'],

    // no spacing about attributes equal sign
    'react/jsx-equals-spacing': ['error', 'never'],

    // allow .js files to contain jsx
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],

    // first attribute is on a new line if multiple lines are used
    'react/jsx-first-prop-new-line': ['error', 'multiline'],

    // handlers naming: onChange={this.handleChange}
    'react/jsx-handler-names': [
      'warn',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on'
      }
    ],

    // attributes indentation: 2 spaces
    'react/jsx-indent-props': ['error', 2],

    // <Jsx> indentation: 2 spaces
    'react/jsx-indent': ['error', 2],

    // detect missing key prop
    'react/jsx-key': 'error',

    // no jsx max children depth
    // 'react/jsx-max-depth'

    // no max props per line (prettier conflict)
    // TODO check how --fix behaves
    // 'react/jsx-max-props-per-line'

    // no arrow functions, or binding, in props
    'react/jsx-no-bind': [
      'warn',
      {
        ignoreDOMComponents: true,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false
      }
    ],

    // prevent accidental comment as text nodes
    'react/jsx-no-comment-textnodes': 'error',

    // prevent duplicate props
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],

    // string literals are allowed
    // TODO override if translated project
    // 'react/jsx-no-literals': 'off',

    // prevent unsecure target _blank
    // https://mathiasbynens.github.io/rel-noopener/
    'react/jsx-no-target-blank': 'warn',

    // no undeclared variables in Jsx too, of course
    'react/jsx-no-undef': 'error',

    // prefer one expression per line
    // disabled because issues with text nodes and indentation
    // 'react/jsx-one-expression-per-line': 'off',

    // component names are PascalCased
    'react/jsx-pascal-case': 'error',

    // consistent spacing between props
    // PRETTIER ?
    'react/jsx-props-no-multi-spaces': 'error',

    // sort default props
    // 'react/jsx-sort-default-props': ['warn', { ignoreCase: true }],

    // sort attributes
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        ignoreCase: true,
        shorthandFirst: false,
        shorthandLast: false,
        noSortAlphabetically: true,
        reservedFirst: true
      }
    ],

    // spacing in tags
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ],

    // prevent React to be marked as unused if there is jsx
    'react/jsx-uses-react': 'error',

    // prevent imported component to be marked as unused when they are used
    'react/jsx-uses-vars': 'error',

    // enforce parentheses around multiline jsx
    'react/jsx-wrap-multilines': 'error',

    // hooks support
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json']
      }
    },
    react: {
      pragma: 'React',
      version: '16.8'
    }
    /*,
    propWrapperFunctions: [
      'forbidExtraProps', // https://www.npmjs.com/package/airbnb-prop-types
      'exact', // https://www.npmjs.com/package/prop-types-exact
      'Object.freeze', // https://tc39.github.io/ecma262/#sec-object.freeze
    ],*/
  }
};
