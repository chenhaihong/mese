const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    // module-resolver
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          // 从mese的依赖中引入react、react-dom、enzyme、enzyme-adapter-react-16
          react: require.resolve('react'),
          'react-dom': require.resolve('react-dom'),
          enzyme: require.resolve('enzyme'),
          'enzyme-adapter-react-16': require.resolve('enzyme-adapter-react-16'),
        },
      }
    ],

    // Stage 0
    require.resolve('@babel/plugin-proposal-function-bind'),

    // Stage 1
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
    [require.resolve('@babel/plugin-proposal-optional-chaining'), { 'loose': false }],
    [require.resolve('@babel/plugin-proposal-pipeline-operator'), { 'proposal': 'minimal' }],
    [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { 'loose': false }],
    require.resolve('@babel/plugin-proposal-do-expressions'),

    // Stage 2
    [require.resolve('@babel/plugin-proposal-decorators'), { 'legacy': true }],
    require.resolve('@babel/plugin-proposal-function-sent'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-numeric-separator'),
    require.resolve('@babel/plugin-proposal-throw-expressions'),

    // Stage 3
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-syntax-import-meta'),
    [require.resolve('@babel/plugin-proposal-class-properties'), { 'loose': false }],
    require.resolve('@babel/plugin-proposal-json-strings'),
  ],
});