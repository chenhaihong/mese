#!/usr/bin/env node

const mess = require('.');
const argvs = process.argv.slice(2);
const pkg = require('./package.json');

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