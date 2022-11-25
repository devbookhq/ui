import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  external: ['react', '@devbookhq/sdk'],
  noExternal: ['@devbookhq/utils'],
  loader: {
    '.svg': 'text',
  },
  sourcemap: true,
})
