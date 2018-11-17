const ERROR = 2;

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'no-console': [
      ERROR,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-constant-condition': [ERROR, { checkLoops: false }],
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      }
    },
  ],
};
