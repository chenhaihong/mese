module.exports = {
  '/get/delayFunction': {
    method: 'get',
    async result() { // 支持延时函数类型，返回结果为纯函数执行结果
      const sleep = function (delay) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, delay);
        });
      };
      await sleep(500);
      return {
        success: true
      };
    }
  }
};