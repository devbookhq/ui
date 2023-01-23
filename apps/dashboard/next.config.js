const exportWrapper = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  : e => e

module.exports = exportWrapper({
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [],
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
  experimental: {
    esmExternals: 'loose',
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
  webpack: config => ({
    ...config,
    experiments: {
      ...config.experiments,
    },
  }),
})
