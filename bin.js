#!/usr/bin/env node

const mess = require('.');
const pkg = require('./package.json');
const argvs = process.argv.slice(2);

if (argvs.includes('build')) {
  mess.build();
} else if (argvs.includes('watch')) {
  mess.watch();
} else {
  console.log(`Mese [${pkg.version}]`);
  console.log('');
  console.log('Examples:');
  console.log('  $ mese build');
  console.log('  $ mese watch');
}