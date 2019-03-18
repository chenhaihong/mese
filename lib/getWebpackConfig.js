/*eslint no-console: 0 */

/**
 * 在使用这个之前需要检测入口文件是否存在
 * webpack配置，包含client、server二个配置。
 * （1）client：构建使用了ReactDOM.hydrate方法的js；
 * （2）server：用于构建服务端渲染文件。
 */

const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const constants = require('./constants');

const extractClientCSSPlugin = new ExtractTextWebpackPlugin({
  filename: '[name].[contenthash:hex:6].css',
  allChunks: true
});

module.exports = getWebpackConfig;

/**
 * 获取构建配置
 * @param {String} mode 构建模式
 * @param {String} meseUrl mese配置地址，绝对路径
 * @param {String} outputPath 存放构建结果的路径，绝对路径
 * @returns {Array} 一个包含2个构建配置对象的数组
 */
function getWebpackConfig(mode, meseUrl, outputPath) {
  return [
    // clientConfig
    {
      target: 'web',
      mode,
      devtool: 'source-map',
      entry: getEntry(meseUrl),
      output: getOutput('client', outputPath), // 输出的文件地址、格式
      module: getModule('client'), // 各种类型文件对应的loader，样式文件的loader包含extractClientCSSPlugin
      plugins: getPlugins(), // 剥离样式的插件
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    // serverConfig
    {
      target: 'node',
      mode,
      devtool: false,
      entry: getEntry(meseUrl),
      output: getOutput('server', outputPath), // 输出的文件地址、格式
      module: getModule('server'), // 各种类型文件对应的loader
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
    }
  ];
}

/**
 * 获取入口
 * @param {String} meseUrl `mese`配置文件的地址 
 * @returns {Function} 一个用于获取构建入口配置的函数
 */
function getEntry(meseUrl) {
  const entry = {};
  const pages = require(meseUrl).pages;
  const { dir } = path.parse(meseUrl); // mese文件的存放目录
  pages.forEach(page => {
    page = path.resolve(dir, page);
    const { name } = path.parse(page);
    entry[name] = page;
  });
  return entry;
}

/**
 * 输出的文件地址、格式
 * @param {String} type 枚举类型，client、server
 * @param {String} outputPath 存放构建结果的目录
 * @returns {Object} 一个包含构建输出配置的对象
 */
function getOutput(type, outputPath) {
  if (type === 'client') {
    return {
      path: outputPath,
      filename: '[name].[hash:6].js',
      chunkFilename: '[name].[hash:6].js',
      library: 'Mese[name]',
      libraryTarget: 'umd',
    };
  }
  return {
    path: outputPath,
    filename: '[name].server.js',
    chunkFilename: '[name].server.js',
    libraryTarget: 'umd',
  };
}

/**
 * 各种类型文件对应的loader，样式文件的loader跟extractClientCSSPlugin有关联
 * @param {String} type 枚举类型，`client`、`server`
 * @returns {Object} 一个包含各种模块的解析规则的对象
 */
function getModule(type) {
  let rules = [
    { resource: { test: /\.html$/ }, use: ['html-loader'] },
    { resource: { test: /\.json$/ }, use: ['json-loader'] },
    {
      resource: {
        test: /\.jsx?$/,
        exclude: [/(node_modules|bower_components)/, /\.test\.js$/],
      },
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
          ],
          plugins: getAllStagePluginsOfBabel(),
        },
      },
    }
  ];
  // 针对客户端样式的配置
  if (type === 'client') {
    rules = [].concat(rules, [
      {
        resource: { test: /\.css$/ },
        use: extractClientCSSPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        resource: { test: /\.less$/ },
        use: extractClientCSSPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      }
    ]);
  }
  // 针对服务端样式的配置，不抽出
  else {
    rules = [].concat(rules, [
      { resource: { test: /\.css$/ }, use: ['isomorphic-style-loader', 'css-loader'], },
      { resource: { test: /\.less$/ }, use: ['isomorphic-style-loader', 'css-loader', 'less-loader'], }
    ]);
  }
  return { rules };
}

/**
 * 获取babel stage0、1、2、3的所有插件
 * @returns {Array} 一个包含`babel-loader`插件配置的数组
 */
function getAllStagePluginsOfBabel() {
  return [
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
    require.resolve('@babel/plugin-proposal-json-strings')
  ];
}

/**
 * 获取插件
 * @returns {Array} 一个包含给客户端配置使用的插件列表
 */
function getPlugins() {
  return [extractClientCSSPlugin, new ManifestPlugin({ fileName: constants.manifestName })];
}

/**
 * 模块的解析路径：从以下两个位置读取
 * @returns {Object} 一个包含模块解析路径列表的对象
 */
function getResolve() {
  return {
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  };
}

/**
 * loader的解析路径：从以下两个位置读取
 * @returns {Object} 一个包含`loader`解析路径列表的对象
 */
function getResolveLoader() {
  return {
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  };
}