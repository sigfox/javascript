const uniqid = require('uniqid');

const configProperties = ['styleSrc', 'frameAncestors', 'fontSrc', 'scriptSrc'];
const mergeAndSanitizeConfigs = (...args) =>
  args.reduce(
    (prevConfig, config) =>
      configProperties.reduce((resultConfig, property) => {
        resultConfig[property] = [...(prevConfig[property] || []), ...(config[property] || [])];
        return resultConfig;
      }, {}),
    {}
  );

const computeParameter = (parameter, values) => {
  if (Array.isArray(values) && values.length > 0) {
    return `${parameter} ${values.join(' ')};`;
  }
  return '';
};

module.exports = globalConfig => async (ctx, next) => {
  const jsNonces = [];

  ctx.templateSecurityMethods = {
    computeJsNonce: () => {
      const nonce = uniqid();
      jsNonces.push(nonce);
      return nonce;
    }
  };

  ctx.setContentSecurityPolicy = (localConfig = {}) => {
    const { styleSrc, frameAncestors, fontSrc, scriptSrc } = mergeAndSanitizeConfigs(
      globalConfig,
      localConfig
    );

    // compute security policy for script
    const computedJsNonces = jsNonces.map(nonce => `'nonce-${nonce}'`);
    const scriptSrcString = computeParameter('script-src', [...scriptSrc, ...computedJsNonces]);

    // compute security policy for style
    const styleSrcString = computeParameter('style-src', styleSrc);

    // compute security policy for font
    const fontSrcString = computeParameter('font-src', fontSrc);

    // compute security policy for frame
    const frameAncestorsString = computeParameter('frame-ancestors', frameAncestors);

    ctx.set(
      'Content-Security-Policy',
      `${scriptSrcString} ${styleSrcString} ${fontSrcString} ${frameAncestorsString}`
    );
  };

  await next();
};
