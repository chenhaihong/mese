module.exports = {
  '/post/pureFunction': {
    method: 'post',
    result(req, res) { // 支持纯函数类型，返回结果为纯函数执行结果
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      });
      return {
        success: true
      };
    }
  }
};