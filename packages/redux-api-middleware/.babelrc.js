module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          ie: 10
        }
      }
    ]
  ]
};
