module.exports = {
  "/post/pureFunction": {
    method: "post",
    result(req, res) {
      // 支持纯函数类型，返回结果为纯函数执行结果
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      });
      return {
        success: true,
        messag: "这是一个纯函数",
      };
    },
  },

  "/get/pureFunction/withError": {
    method: "get",
    result(req, res) {
      // 这里执行出错，会进入错误处理器，得到的返回结果是500页面
      return {
        success: true,
        message: message,
      };
    },
  },
};
