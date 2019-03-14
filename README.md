# mese

一个简易的 React ssr 框架。

# 安装

```s
$ npm i mese
```

# 配置

在项目下添加 `mese.js`：

```javascript
module.exports = {
  pages: [
    './pages/home.js' // 数组第一个作为首页，文件名称是页面名称
  ]
};
```

# 使用

```s
$ mese build
$ mese serve --open --port 8080
```