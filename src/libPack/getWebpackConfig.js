/*eslint no-console: 0 */

/**
 * 在使用这个之前需要先检测入口文件是否存在。
 * webpack配置，包含3个配置:
 * (1) app-client-config: 这个配置用于构建出给web浏览器使用的js文件，格式为`[name].[hash:6].js`，
 *                        `ReactDOM.hydrate`方法会用到它。
 * (2) app-node-config: 这个配置用于构建出给node服务使用的js文件，格式为`[name].node.js`，
 *                      `ReactDOMServer.renderToStaticMarkup`方法会用到它。
 * (3) ssr-server-config: 这个配置用于构建出`web server`的js文件，格式为`server.js`，
 *                        通过`node server.js`或`pm2 start server.js`
*                         启动web服务的时候会用到它。
 */

const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const constants = require('../helper/constants');

const [APP_CLIENT, APP_NODE, SSR_SERVER] = [0, 1, 2]; // 三种配置类型
const extractClientCSSPlugin = new ExtractTextWebpackPlugin({
  filename: '[name].[contenthash:hex:6].css',
  allChunks: true
});

let _meseDir = null, _meseUrl = null, _outputPath = null;

module.exports = getWebpackConfig;

/**
 * 获取构建配置
 * @param {String} mode 构建模式
 * @param {String} meseUrl mese配置地址，绝对路径
 * @param {String} outputPath 存放构建结果的目录路径，绝对路径
 * @returns {Array} 一个包含2个构建配置对象的数组
 */
function getWebpackConfig(mode, meseUrl, outputPath) {
  // initialize local variable
  const { dir } = path.parse(meseUrl); // mese文件的存放目录
  _meseDir = dir, _meseUrl = meseUrl, _outputPath = outputPath;

  return [
    // app-client-config
    {
      name: 'APP_CLIENT',
      target: 'web',
      mode,
      devtool: 'source-map',
      entry: getEntry(APP_CLIENT),
      output: getOutput(APP_CLIENT), // 输出的文件地址、格式
      module: getModule(APP_CLIENT), // 各种类型文件对应的loader，样式文件的loader包含extractClientCSSPlugin
      plugins: getPlugins(), // 剥离样式的插件
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    // app-node-config
    {
      name: 'APP_NODE',
      target: 'node',
      mode,
      devtool: false,
      entry: getEntry(APP_NODE),
      output: getOutput(APP_NODE), // 输出的文件地址、格式
      module: getModule(APP_NODE), // 各种类型文件对应的loader
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
    },
    // ssr-server-config
    {
      name: 'SSR_SERVER',
      target: 'node',
      mode,
      devtool: 'source-map',
      entry: getEntry(SSR_SERVER),
      output: getOutput(SSR_SERVER),
      module: getModule(SSR_SERVER), // 各种类型文件对应的loader
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
    }
  ];
}

/**
 * 获取APP_CLIENT与APP_NODE的文件入口
 * @param {String} type 枚举类型，`APP_CLIENT`, `APP_NODE`, `SSR_SERVER`
 * @returns {Function} 一个用于获取构建入口配置的函数
 */
function getEntry(type) {
  const entry = {};
  switch (type) {
    case APP_CLIENT:
    case APP_NODE:
      const pages = require(_meseUrl).pages;
      pages.forEach(page => {
        page = path.resolve(_meseDir, page);
        const { name } = path.parse(page);
        entry[name] = page;
      });
      break;
    case SSR_SERVER:
      entry.server = path.join(__dirname, 'server.js');
      break;
  }
  return entry;
}

/**
 * 输出的文件地址、格式
 * @param {String} type 枚举类型，`APP_CLIENT`, `APP_NODE`, `SSR_SERVER`
 * @returns {Object} 一个包含构建输出配置的对象
 */
function getOutput(type) {
  let output = {};
  switch (type) {
    case APP_CLIENT:
      output = {
        path: _outputPath,
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].js',
        library: 'mese_[name]',
        libraryTarget: 'umd',
      };
      break;
    case APP_NODE:
      output = {
        path: _outputPath,
        filename: '[name].node.js',
        chunkFilename: '[name].node.js',
        libraryTarget: 'umd',
      };
      break;
    case SSR_SERVER:
      output = {
        path: _outputPath,
        filename: 'server.js',
        chunkFilename: 'server.js',
      };
      break;
  }
  return output;
}

/**
 * 各种类型文件对应的loader，样式文件的loader跟extractClientCSSPlugin有关联
 * @param {String} type 枚举类型，`APP_CLIENT`, `APP_NODE`, `SSR_SERVER`
 * @returns {Object} 一个包含各种模块的解析规则的对象
 */
function getModule(type) {
  let rules = [];
  const commonRules = [ // 通用的loader配置
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
  const appClientRules = [ // 针对APP_CLIENT端样式的配置
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
  ];
  const appNodeRules = [ // 针对APP_NODE端样式的配置，不抽出
    { resource: { test: /\.css$/ }, use: ['isomorphic-style-loader', 'css-loader'], },
    { resource: { test: /\.less$/ }, use: ['isomorphic-style-loader', 'css-loader', 'less-loader'], }
  ];
  switch (type) {
    case APP_CLIENT:
      rules = commonRules.concat(appClientRules);
      break;
    case APP_NODE:
      rules = commonRules.concat(appNodeRules);
      break;
    case SSR_SERVER:
      rules = commonRules;
      break;
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
  return [
    extractClientCSSPlugin,
    new ManifestPlugin({ fileName: constants.manifestName })
  ];
}

/**
 * 模块的解析路径：从以下两个位置读取
 * @returns {Object} 一个包含模块解析路径列表的对象
 */
function getResolve() {
  return {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
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