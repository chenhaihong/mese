# mese

[![npm](https://img.shields.io/npm/v/mese.svg)](https://www.npmjs.com/package/mese)
[![NPM](https://img.shields.io/npm/l/mese.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)](https://www.npmjs.com/package/mese)
[![Build Status](https://travis-ci.org/chenhaihong/mese.svg?branch=master)](https://travis-ci.org/chenhaihong/mese)
[![Coverage Status](https://coveralls.io/repos/github/chenhaihong/mese/badge.svg?branch=master)](https://coveralls.io/github/chenhaihong/mese?branch=master)

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