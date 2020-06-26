module.exports = () => {
  return {
    module: {
      rules: [
        // 针对 pure css, 最后忽略掉，减少体积
        {
          resource: { test: /\.css$/i, exclude: /\.m\.css$/i },
          use: ["ignore-loader", "css-loader"],
        },
        // 针对 pure less, 最后忽略掉，减少体积
        {
          resource: { test: /\.less$/i, exclude: /\.m\.less$/i },
          use: ["ignore-loader", "css-loader", "less-loader"],
        },
        // 针对 css module， 需要同构支持
        {
          resource: { test: /\.m\.css$/i },
          use: [
            "isomorphic-style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                localsConvention: "camelCase",
                importLoaders: 1,
              },
            },
          ],
        },
        // 针对 less module， 需要同构支持
        {
          resource: { test: /\.m\.less$/i },
          use: [
            "isomorphic-style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                url: false,
                localsConvention: "camelCase",
                importLoaders: 2,
              },
            },
            "less-loader",
          ],
        },
      ],
    },
  };
};
