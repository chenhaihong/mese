module.exports = () => {
  return {
    optimization: {
      splitChunks: {
        cacheGroups: {
          // 抽取来自 node_modules 文件夹下的第三方代码，优先级权重为10
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 10, // 优先级
          },
          // 抽取来自 src 文件夹下的代码，优先级权重为5
          common: {
            name: "common",
            test: /[\\/]src[\\/]/,
            minSize: 1024,
            chunks: "all",
            priority: 5,
          },
        },
      },
    },
  };
};
