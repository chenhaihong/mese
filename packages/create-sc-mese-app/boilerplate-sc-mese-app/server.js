#!/usr/bin/env node

// 使用pm2运行这个文件来启动守护进程

const { join } = require("path");
const Server = require("@mese/server");

const [meseAppDir, host, port] = [join(__dirname, "dist"), "127.0.0.1", "3000"];

new Server({
  meseAppDir,
  host,
  port,
  success: Server.startUpSuccessfully,
  fail: Server.startUpUnsuccessfully,
});
