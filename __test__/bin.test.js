
// test('mese should build successfully', () => {
//   expect(1).toEqual(1);
// });

const path = require('path');
const execSh = require('exec-sh');

const bin = path.resolve(__dirname, '../bin.js');
const cwd = path.resolve(__dirname, './demo');
execSh(`node ${bin} watch`, { cwd });