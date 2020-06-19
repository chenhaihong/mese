#!/usr/bin/env node

const path = require("path");
const openPage = require("open");

const Server = require("../lib/Server");

const argv = require("minimist")(process.argv.slice(2));

let { meseAppDir = "", host = "127.0.0.1", port = 3000, open = false } = argv;
meseAppDir = path.join(process.cwd(), meseAppDir);

new Server({
  meseAppDir,
  host,
  port,
  success: (port) => {
    open && openPage(`http://localhost:${port}`);
    Server.startUpSuccessfully(port);
  },
  fail: Server.startUpUnsuccessfully,
});
