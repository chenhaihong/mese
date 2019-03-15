/*eslint no-console: 0 */

/**
 * webpack配置，包含client、server二个配置。
 * （1）client：构建使用了ReactDOM.hydrate方法的js；
 * （2）server：用于构建服务端渲染文件。
 */

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const constants = require('./constants');

const extractClientCSSPlugin = new ExtractTextWebpackPlugin({
  filename: '[name].[contenthash:hex:6].css',
  allChunks: true
});

module.exports = (mode) => {
  return [
    // clientConfig
    {
      target: 'web',
      mode,
      devtool: 'source-map',
      entry: getEntry(),
      output: getOutput('client'), // 输出的文件地址、格式
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
      entry: getEntry(),
      output: getOutput('server'), // 输出的文件地址、格式
      module: getModule('server'), // 各种类型文件对应的loader
      resolve: getResolve(), // 模块的解析路径
      resolveLoader: getResolveLoader(), // loader的解析路径
    }
  ];
};

/**
 * 动态获取入口，https://webpack.js.org/configuration/entry-context#dynamic-entry
 */
function getEntry() {
  return () => {
    const entry = {};
    const customedConf = getCustomedConf();
    const pages = customedConf.pages || [];
    pages.forEach(page => {
      const _page = safePath(page);
      if (fse.pathExistsSync(_page) && fs.statSync(_page).isFile()) {
        const { name } = path.parse(_page);
        entry[name] = _page;
      } else {
        // TODO 抛出错误，统一报错规范
        console.log(`${page} not found.`);
        process.exit(-1);
      }
    });

    return entry;
  };
}

/**
 * 用户配置
 */
function getCustomedConf() {
  const url = path.resolve(process.cwd(), constants.mese);
  let config = {};
  if (fse.pathExistsSync(url)) {
    config = require(url);
  }
  return config;
}

/**
 * 返回绝对路径
 * @param {String} filePath 当前工作目录下的路径
 */
function safePath(filePath) {
  filePath = filePath.trim();

  // 如果是 / 或 \ 开头的目录，加上 . 前缀，避免对根目录进行清空操作
  /^(\/|\\)/.test(filePath) && (filePath = '.' + filePath);

  return path.resolve(process.cwd(), filePath);
}

/**
 * 输出的文件地址、格式
 * @param {String} type 枚举类型，client、server
 */
function getOutput(type) {
  if (type === 'client') {
    return {
      path: path.resolve(process.cwd(), constants.dist),
      filename: '[name].[hash:6].js',
      chunkFilename: '[name].[hash:6].js',
      library: 'Mese[name]',
      libraryTarget: 'umd',
    };
  }
  return {
    path: path.resolve(process.cwd(), constants.dist),
    filename: '[name].server.js',
    chunkFilename: '[name].server.js',
    libraryTarget: 'umd',
  };
}

/**
 * 各种类型文件对应的loader，样式文件的loader跟extractClientCSSPlugin有关联
 * @param {String} type 枚举类型，client、server
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
 */
function getPlugins() {
  return [extractClientCSSPlugin, new ManifestPlugin({ fileName: constants.manifest })];
}

/**
 * 模块的解析路径：从以下两个位置读取
 */
function getResolve() {
  return {
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  };
}

/**
 * loader的解析路径：从以下两个位置读取
 */
function getResolveLoader() {
  return {
    modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  };
}