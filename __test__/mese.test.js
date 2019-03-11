
// test('mese should build successfully', () => {
//   expect(1).toEqual(1);
// });

const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../bin/mese');
const cwd = path.resolve(__dirname, './demo');
execSh(`node ${mese} watch --development`, { cwd });