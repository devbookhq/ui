const { withSentryConfig } = require('@sentry/nextjs')

function isPlugin(maybePlugin) {
  return typeof maybePlugin === 'function'
}

function composePlugins(...plugins) {
  return (baseConfig) => plugins
    .filter(isPlugin)
    .reduce((c, plugin) => plugin(c), baseConfig)
}

const pluginWrapper = composePlugins(
  require('next-transpile-modules')(['@devbookhq/code-editor', '@devbookhq/codemirror-textmate']),
  process.env.ANALYZE && require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' }),
  // Make sure adding Sentry options is the last code to run before exporting, to
  // ensure that your source maps include changes from all other Webpack plugins
  process.env.SENTRY !== '0' && (config => withSentryConfig(config, {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  })),
)

const config = {
  reactStrictMode: false,
  images: { domains: ['website-v8.vercel.app'] },
  assetPrefix: process.env.ASSET_PREFIX || '',
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = pluginWrapper(config)
