---
order: 4000
title: 接口入口
---

`mese` 支持自定义接口，提供了 3 种类型的支持：

- 纯 json 格式数据
- 纯函数
- 异步函数

同时，在处理接口的逻辑时，在外层使用了 `try-catch`，如果接口出错，将会进入 `500` 页面。

## 纯 json 格式数据

```javascript
module.exports = {
  '/get/json': {
    method: 'get', // 请求类型
    result: {
      success: true,
      message: '这是纯json格式数据',
    },
  },
  '/get/book/:id': {
    dynamic: true,
    method: 'get', // 请求类型
    result: {
      success: true,
      message: '这是纯json格式数据',
    },
  },
};
```

## 纯函数

```javascript
module.exports = {
  '/post/pureFunction': {
    method: 'post',
    result(req, res) {
      // 支持纯函数类型，返回结果为纯函数执行结果
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      });
      return {
        success: true,
        messag: '这是一个纯函数',
      };
    },
  },
  '/get/user/:id': {
    dynamic: true,
    method: 'get',
    result(req, res) {
      const { id } = req.params;
      // 这里执行出错，会进入错误处理器，得到的返回结果是500页面
      return {
        success: true,
        id,
      };
    },
  },
  '/get/pureFunction/withError': {
    method: 'get',
    result(req, res) {
      // 这里执行出错，会进入错误处理器，得到的返回结果是500页面
      return {
        success: true,
        message: message,
      };
    },
  },
};
```

## 异步函数

```javascript
module.exports = {
  '/get/delayFunction': {
    method: 'get',
    async result() {
      // 支持async函数类型
      const sleep = function(delay) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, delay);
        });
      };
      await sleep(50);
      return {
        success: true,
        message: '这是一个异步函数',
      };
    },
  },
};
```
