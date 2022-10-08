module.exports = {
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
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 90,
}
