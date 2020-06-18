module.exports = {
  "/get/delayFunction": {
    method: "get",
    async result() {
      // 支持async函数类型
      const sleep = function (delay) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, delay);
        });
      };
      await sleep(50);
      return {
        success: true,
        message: "这是一个异步函数",
      };
    },
  },
};
