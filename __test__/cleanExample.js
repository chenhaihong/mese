const path = require('path');
const fs = require('fs-extra');

fs.removeSync(path.join(__dirname, '../example/dist'));
fs.removeSync(path.join(__dirname, '../example/node_modules'));