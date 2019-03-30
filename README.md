# mese

[![npm](https://img.shields.io/npm/v/mese.svg)](https://www.npmjs.com/package/mese)
[![LICENSE](https://camo.githubusercontent.com/49a7af1a72e77122a5866680bd68a4cd5b703c54/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4e504c2532302854686525323039393625323050726f686962697465642532304c6963656e7365292d626c75652e737667)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
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

# 测试

执行以下命令，会测试项目中的 `*.test.js`、`*.spec.js`。

```shell
$ mese test
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