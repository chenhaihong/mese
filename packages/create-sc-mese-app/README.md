# @mese/create-sc-mese-app

快速生成 `mese` 应用的源码。

## 下载源代码

```bash
$ npx @mese/create-sc-mese-app # 在当前工作空间下生成

# 或者
$ npx @mese/create-sc-mese-app helloworld # 在当前工作空间的helloworld目录下生成
```

## 安装依赖

```bash
$ npm install
```

## 构建

```bash
# 生产模式构建
$ npm run build

# 监听文件变动，然后构建
$ npm run watch

# 添加文件变化，启动 web server
$ npm run devServer
```

## 启动服务

```bash
$ npm run serve

# 或者使用pm2启动目录下的server.js
$ pm2 start server.js
```
