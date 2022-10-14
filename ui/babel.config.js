const vinicunca = require('./package.json');

module.exports = {
  assumptions: {
    noDocumentAll: true,
  },
  ignore: [/\.d\.ts$/],
  presets: [
    ['@babel/preset-env', {
      modules: false,
    }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@vue/babel-plugin-jsx', { optimize: false, enableObjectSlots: false }],
    ['transform-define', {
      __VERSION__: vinicunca.version,
      __REQUIRED_VUE__: vinicunca.peerDependencies.vue,
    }],
    ['module-resolver', {
      root: ['.'],
      alias: {
        '~': './src',
      },
    }],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: true },
          modules: 'commonjs',
        }],
      ],
    },
    lib: {
      ignore: ['**/__tests__', '**/test-utils/*'],
      plugins: [
        ['babel-plugin-add-import-extension', { extension: 'mjs' }],
      ],
    },
  },
};
