# mese

[![npm](https://img.shields.io/npm/v/mese.svg)](https://www.npmjs.com/package/mese)
[![LICENSE](https://camo.githubusercontent.com/f8e5f328cd5ac4b59476348cb3f13feffd89c97a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d3939364943552d677265656e2e737667)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/chenhaihong/mese.svg?branch=master)](https://travis-ci.org/chenhaihong/mese)
[![codecov](https://codecov.io/gh/chenhaihong/mese/branch/master/graph/badge.svg)](https://codecov.io/gh/chenhaihong/mese)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)


一个简易的 react ssr 框架。

# 安装

```shell
$ npm i -g mese
```

# 项目初始化

```shell
$ mkdir demo && cd demo
$ mese init
```

# 构建 && 启动服务

```shell
$ mese build --development # 开发模式
$ mese serve --port 8080 --open # 使用8080端口，自动打开首页
```

# 配置

项目里的 `mese.config.js` 作为 `mese` 的配置：

```js
module.exports = {
  pages: [
    './pages/home.js', // 数组第一个作为首页，文件名称是页面名称
    './pages/404.js', // 名称为404的页面将作为404页面
    './pages/500.js' // 名称为500的页面将作为500页面
  ]
};
```