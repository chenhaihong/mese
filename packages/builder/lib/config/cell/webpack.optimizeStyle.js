const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (isProd) => {
  return {
    // 剥离样式的插件
    plugins: [
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      // https://www.npmjs.com/package/mini-css-extract-plugin#minimal-example
      new MiniCssExtractPlugin({
        // 这里的处理原因：
        // mini-css-extract-plugin配合热更新时，
        // 虽然每次update都加载了正确的hot-update.json，
        // 但是，最终引入的css文件总是首次构建出来的那一个，导致热更新看起来是不生效的。
        // 通过这么处理，在开发模式上，不加入hash值，保证每次update都能拿到最新构建出来的样式文件。
        filename: `[name]${isProd ? ".[hash:6]" : ""}.css`,
        chunkFilename: `[id]${isProd ? ".[hash:6]" : ""}.css`,
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    module: {
      rules: [
        // ******************************************
        // Pure CSS (without CSS modules)
        // ******************************************
        {
          resource: { test: /\.css$/i, exclude: /\.m\.css$/i },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // hmr: process.env.NODE_ENV === 'development',
                hmr: !isProd,
              },
            },
            {
              // options 配置文档
              // https://github.com/webpack-contrib/css-loader#options
              loader: "css-loader",
              options: {
                importLoaders: 1, // 1 => postcss-loader;
                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, less-loader
              },
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve(__dirname),
                },
              },
            },
          ],
        },
        // ******************************************
        // Pure Less (without CSS modules)
        // ******************************************
        {
          resource: { test: /\.less$/i, exclude: /\.m\.less$/i },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProd,
              },
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 2, // 2 => postcss-loader, less-loader
              },
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve(__dirname),
                },
              },
            },
            "less-loader",
          ],
        },
        // *********************
        // CSS modules
        // *********************
        {
          resource: { test: /\.m\.css$/i },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // hmr: process.env.NODE_ENV === 'development',
                hmr: !isProd,
              },
            },
            {
              loader: "css-loader",
              options: {
                // 启用 CSS Modules
                modules: true,
                // Disables url/image-set functions handling
                url: false,
                // Class names will be camelized, the original class name will be removed from the locals
                // https://www.npmjs.com/package/css-loader#localsconvention
                localsConvention: "camelCase",
                importLoaders: 1, // 1 => postcss-loader;
                // https://www.npmjs.com/package/css-loader#localidentname
                // localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve(__dirname),
                },
              },
            },
          ],
        },
        // *********************
        // Less modules
        // *********************
        {
          resource: { test: /\.m\.less$/i },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProd,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                localsConvention: "camelCase",
                importLoaders: 2, // 2 => postcss-loader, less-loader
                // localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve(__dirname),
                },
              },
            },
            "less-loader",
          ],
        },
      ],
    },
  };
};
