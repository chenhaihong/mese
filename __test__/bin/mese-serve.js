
const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../../bin/mese');
const cwd = path.resolve(__dirname, '../../example');
execSh(`node ${mese} serve --open --port 8080`, { cwd });