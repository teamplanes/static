module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:flowtype/recommended'],
  parser: 'babel-eslint',
  plugins: ['prettier', 'flowtype'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};
