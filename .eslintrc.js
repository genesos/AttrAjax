module.exports = {
  'extends': 'eslint-config-airbnb-base/legacy',
  'rules': {
    'max-len': [1, 140],
    'func-names': 0,
    'newline-per-chained-call': [1, { ignoreChainWithDepth: 3 }],
    'no-alert': 0,
    'no-underscore-dangle': [1, { 'allow': ['_this'] }]
  },
  env: {
    browser: true,
    amd: true
  }
};
