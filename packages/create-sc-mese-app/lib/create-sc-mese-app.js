#!/usr/bin/env node

const path = require("path");
const fse = require("fs-extra");

const argv = require("minimist")(process.argv.slice(2));
const dirCustomed = argv._[0] || "";

const dirSourceCode = path.join(__dirname, "..", "boilerplate-sc-mese-app");
const dirTarget = path.join(process.cwd(), dirCustomed);

console.log("正在生成...");

fse.copySync(dirSourceCode, dirTarget);

console.log("已经生成 mese app 源码！");
