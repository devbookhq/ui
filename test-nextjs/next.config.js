/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@devbookhq/code-editor'])

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
  },
}

// module.exports = nextConfig
module.exports = withTM(nextConfig)
