module.exports = () => {
  return {
    module: {
      rules: [
        // pure css
        {
          resource: { test: /\.css$/i, exclude: /\.m\.css$/i },
          use: ["isomorphic-style-loader", "css-loader"],
        },
        // pure less
        {
          resource: { test: /\.less$/i, exclude: /\.m\.less$/i },
          use: ["isomorphic-style-loader", "css-loader", "less-loader"],
        },
        // css module
        {
          resource: { test: /\.m\.css$/i },
          use: ["isomorphic-style-loader", "css-loader"],
        },
        // less module
        {
          resource: { test: /\.m\.less$/i },
          use: ["isomorphic-style-loader", "css-loader", "less-loader"],
        },
      ],
    },
  };
};
