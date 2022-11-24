module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-devbookhq`
  extends: ['devbookhq'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
