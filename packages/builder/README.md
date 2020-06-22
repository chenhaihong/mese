# @mese/builder

打包器。

## 命令行使用

```bash
$ mese-build --mode=production --meseConfigUrl=mese.config.js --outputPath=dist

# 或者
$ mese-watch --mode=development --meseConfigUrl=mese.config.js --outputPath=dist
```

## API

### builder.build

```javascript
const path = require("path");
const builder = require("@mese/builder");
const [mode, meseConfigUrl, outputPath] = [
  "production",
  path.join(__dirname, "mese.config.js"),
  path.join(__dirname, "dist"),
];
const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
builder.build(config, function (err, stats) {
  // TODO 处理
});
```

### builder.watch

```javascript
const path = require("path");
const builder = require("@mese/builder");
const [mode, meseConfigUrl, outputPath] = [
  "production",
  path.join(__dirname, "mese.config.js"),
  path.join(__dirname, "dist"),
];
const config = getWebpackConfig({ mode, meseConfigUrl, outputPath });
builder.watch(config, (err, stats, watching) => {
  // TODO 处理
});
```

## Links

处理错误和 stats 对象，阅读下面的文档，

- err 处理
  https://v4.webpack.docschina.org/api/node/#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86-error-handling-
- stats 的使用
  https://v4.webpack.docschina.org/api/node/#stats-对象-stats-object-
