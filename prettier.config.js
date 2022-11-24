const pluginSortImports = require('@trivago/prettier-plugin-sort-imports')
const pluginTailwindcss = require('prettier-plugin-tailwindcss')

/** @type {import("prettier").Parser}  */
const myParser = {
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
}

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    typescript: myParser,
  },
}

module.exports = {
  arrowParens: 'avoid',
  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [myPlugin],
  printWidth: 90,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
}