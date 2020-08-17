module.exports = {
  extends: [
    './rules/best-practices',
    './rules/errors',
    './rules/node',
    './rules/style',
    './rules/variables',
    './rules/es6',
    './rules/imports'
  ].map(require.resolve),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['prefer-object-spread'],
  rules: {
    strict: 'error',
    'prefer-object-spread/prefer-object-spread': 'error'
  }
};
