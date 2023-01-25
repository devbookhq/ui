const exportWrapper = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  : e => e

module.exports = exportWrapper({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    ...(process.env.NODE_ENV === 'production' && {
      removeConsole: {
        exclude: ['error'],
      },
    }),
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects',
        permanent: false,
      },
    ]
  },
})
