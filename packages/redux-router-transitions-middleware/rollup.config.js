import babel from 'rollup-plugin-babel';
import commonJs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const externalDependencies = [];
if (pkg.peerDependencies) externalDependencies.push(...Object.keys(pkg.peerDependencies));
if (pkg.devDependencies) externalDependencies.push(...Object.keys(pkg.devDependencies));
if (pkg.dependencies) externalDependencies.push(...Object.keys(pkg.dependencies));

const rollupConfig = [
  {
    input: 'src/index.js',
    external: externalDependencies,
    output: [
      { exports: 'named', format: 'cjs', sourcemap: true, file: 'lib/index.cjs.js' },
      { format: 'esm', sourcemap: true, file: 'lib/index.esm.js' }
    ],
    plugins: (options = {}) => [
      sourceMaps(),
      json(),
      nodeResolve(options.resolveConfig || {}),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: true
      }),
      commonJs({
        ignoreGlobal: true
      })
    ]
  }
];

export default rollupConfig;
