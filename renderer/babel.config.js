const { devDependencies } = require('../package.json');

module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            electron: devDependencies.electron.replace(/^\^|~/, ''),
          },
        },
      },
    ],
    '@emotion/babel-preset-css-prop',
  ],
  plugins: [
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
  ],
};
