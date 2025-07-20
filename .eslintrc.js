module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  root: true,
  env: {
    node: true,
    jest: true,
    es2020: true
  },
  rules: {
    // Basic rules only
    'no-unused-vars': 'off',
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-case-declarations': 'off',
    'no-control-regex': 'off',
    'no-empty': 'off'
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'dist/', 'coverage/', 'node_modules/']
};