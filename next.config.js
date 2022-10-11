const exportWrapper = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
    })
  : e => e

module.exports = exportWrapper({
  reactStrictMode: true,
  swcMinify: true,
  env: {},
  webpack: config => ({
    ...config,
    experiments: {
      ...config.experiments,
    },
  }),
})
