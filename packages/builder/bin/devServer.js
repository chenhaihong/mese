#!/usr/bin/env node

const chalk = require("chalk");
const ora = require("ora");
const Server = require("@mese/Server");

const spinner = ora("Starting server...").start();
const { meseAppDir, host, port } = process.env;
new Server({
  meseAppDir,
  host,
  port,
  success: (port) => {
    spinner.stop();

    const arr = [
      chalk.bgGreenBright.black(" Mese "),
      "Listening on",
      chalk.greenBright.underline(`http://${host}:${port}`),
    ];
    console.log("\n", ...arr, "\n");
  },
  fail: (e, port) => {
    spinner.stop();

    Server.startUpUnsuccessfully(e, port);
  },
});
