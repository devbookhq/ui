const exportWrapper = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
    })
  : e => e

module.exports = exportWrapper({
  reactStrictMode: true,
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  swcMinify: true,
  env: {},
  webpack: config => ({
    ...config,
    experiments: {
      ...config.experiments,
    },
  }),
})
