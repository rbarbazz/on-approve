module.exports = {
  env: {
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'sort-imports': ['error', { allowSeparatedGroups: true, ignoreCase: true }],
    'sort-keys': ['error', 'asc', { caseSensitive: false }],
  },
}
