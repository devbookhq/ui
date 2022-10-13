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
  plugins: [myPlugin],
  singleQuote: true,
  tabWidth: 2,
  semi: false,
  arrowParens: 'avoid',
  trailingComma: 'all',
  singleAttributePerLine: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^components/(.*)$',
    '^pages/(.*)$',
    '^utils/(.*)$',
    '^hooks/(.*)$',
    '^core/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 90,
}
