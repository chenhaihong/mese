
const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../mese');
const cwd = path.resolve(__dirname, '../../example');
execSh(`node ${mese} init -dir ./hello-mese`, { cwd });