module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['unused-imports', 'tailwindcss', 'prettier'],
  rules: {
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',
    'tailwindcss/migration-from-tailwind-2': 'warn',
    'tailwindcss/no-arbitrary-value': 'off',
    'tailwindcss/no-custom-classname': 'error',
    'tailwindcss/no-contradicting-classname': 'error',
    'unused-imports/no-unused-imports': 'error',
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
    'max-len': [
      'error',
      {
        code: 90,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
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
  },
}
