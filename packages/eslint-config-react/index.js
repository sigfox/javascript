module.exports = {
  extends: ["@sigfox/eslint-config", "./rules/react"].map(require.resolve),
  rules: {
    "import/no-commonjs": "error"
  }
};
