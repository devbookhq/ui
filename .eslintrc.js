module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier', 'unused-imports'],
  rules: {
    semi: [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'prettier/prettier': ['error'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
