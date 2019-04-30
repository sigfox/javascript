import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const externalDependencies = [];
if (pkg.peerDependencies) externalDependencies.push(...Object.keys(pkg.peerDependencies));
if (pkg.devDependencies) externalDependencies.push(...Object.keys(pkg.devDependencies));
if (pkg.dependencies) externalDependencies.push(...Object.keys(pkg.dependencies));

const rollupConfig = {
  input: 'src/index.js',
  external: externalDependencies,
  output: [
    { exports: 'named', format: 'cjs', sourcemap: true, file: 'lib/index.cjs.js' },
    { format: 'esm', sourcemap: true, file: 'lib/index.esm.js' }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};

export default rollupConfig;
