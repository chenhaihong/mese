
const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../mese');
execSh(`node ${mese} init -d ./hello-mese`);