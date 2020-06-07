module.exports = () => {
  return {
    module: {
      rules: [
        {
          resource: {
            test: /\.jsx?$/,
            exclude: [/(node_modules|bower_components)/, /\.test\.js$/],
          },
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [require.resolve("@mese/babel-preset-react")],
            },
          },
        },
      ],
    },
  };
};
