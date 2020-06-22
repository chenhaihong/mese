---
nav:
  title: 使用指南

order: 1000
title: 快速开始
---

`mese` 是一个简陋的 React SSR 框架。阅读下面文档来快速使用它。

## 环境准备

node 版本是 10.13 或以上。

```bash
$ node -v
v10.13.0
```

## 脚手架初始化

执行下面命令生成源码：

```bash
$ mkdir myapp && cd myapp
$ npx @mese/create-sc-mese-app

# 或者
$ npx @mese/create-sc-mese-app myapp
```

如果不支持 `npx`，可以通过这种方式生成源码，

```bash
$ npm i -g @mese/create-sc-mese-app
$ create-sc-mese-app myapp
```

## 开发

### 安装依赖

```bash
$ npm install
```

### 构建

```bash
$ npm run build
$ npm run watch
```

### 启动服务

```bash
$ npm run serve
```

## 代码结构

代码结构如下：

```
├─ pages/
│   ├─ common.less
│   ├─ 404.js
│   ├─ 500.js
│   ├─ home.js
│   └─ pageWithPreloadedState.js
│
├─ api/
│   ├─ asyncFunction.js
│   ├─ json.js
│   └─ pureFunction.js
│
├─ mese.config.js
├─ package.json
└─ server.js
```
