import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      name: pkg.name,
      file: pkg.umd,
      format: 'umd',
      sourcemap: true,
    },
    {
      name: pkg.name,
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
    {
      name: pkg.name,
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime', '@devbookhq/sdk'],
  plugins: [
    string({
      // Required to be specified
      include: '**/*.svg',
    }),
    autoExternal({ builtins: false }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
    }),
    postcss({
      extensions: ['.css'],
      inject: {
        insertAt: 'top',
      },
      config: {
        path: './postcss.config.js',
      },
    }),
    typescript(),
    nodePolyfills(),
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ],
}
