const exportWrapper = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
    })
  : e => e

module.exports = exportWrapper({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    ...(process.env.NODE_ENV === 'production' && {
      removeConsole: {
        exclude: ['error'],
      },
    }),
  },
  experimental: {
    newNextLinkBehavior: true,
  },
  env: {},
  webpack: config => ({
    ...config,
    experiments: {
      ...config.experiments,
    },
  }),
})
