import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default {
  input: 'src/inline.ts',
  output: [
    {
      name: pkg.name,
      file: pkg.umd,
      format: 'umd',
      sourcemap: false,
    },
    {
      name: pkg.name,
      file: pkg.main,
      format: 'cjs',
      sourcemap: false,
      exports: 'auto',
    },
    {
      name: pkg.name,
      file: pkg.module,
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    postcss({
      minimize: true,
      extensions: ['.css'],
      inject: {
        insertAt: "top",
      },
      config: {
        path: './postcss.config.js',
      },
    }),
    typescript({ tsconfig: './tsconfig.inline.json' }),
    nodeResolve(),
    terser(),
  ],
}
