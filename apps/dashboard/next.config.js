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
  experimental: {
    esmExternals: 'loose',
    swcPlugins: [['next-superjson-plugin', {}]],
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
}

module.exports = pluginWrapper(config)
