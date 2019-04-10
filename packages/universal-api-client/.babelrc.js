module.exports = {
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties'],
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
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
};
