module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier', 'unused-imports'],
  rules: {
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        shorthandFirst: false,
        shorthandLast: true,
        multiline: 'last',
        ignoreCase: true,
        noSortAlphabetically: false,
      },
    ],
    semi: ['error', 'never'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'prettier/prettier': ['error'],
    'unused-imports/no-unused-imports': 'error',
  },
}
