# @mese/server

使用 express 封装 web server，用于快速启动一个 `mese` 应用。

## 命令行使用

```bash
$ mese-serve --meseAppDir=dist --host=127.0.0.1 --port=3000 --open
```

## API

```javascript
const path = require("path");
const Server = require("@mese/Server");

const [meseAppDir, host, port] = [
  path.join(process.cwd(), "dist"),
  "127.0.0.1",
  3000,
];

new Server({
  meseAppDir,
  host,
  port,
  success: Server.startUpSuccessfully,
  fail: Server.startUpUnsuccessfully,
});
```
