function isPlugin(maybePlugin) {
  return typeof maybePlugin === 'function'
}

function composePlugins(...plugins) {
  return (baseConfig) => plugins
    .filter(isPlugin)
    .reduce((c, plugin) => plugin(c), baseConfig)
}

const pluginWrapper = composePlugins(
  process.env.ANALYZE && require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' }),
)

const config = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@devbookhq/code-editor'],
  experimental: {
    esmExternals: 'loose',
  },
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
}

module.exports = pluginWrapper(config)
