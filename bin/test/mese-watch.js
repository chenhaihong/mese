
// test('mese should build successfully', () => {
//   expect(1).toEqual(1);
// });

const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../mese');
const cwd = path.resolve(__dirname, '../../example');
// execSh(`node ${mese} build`, { cwd });
execSh(`node ${mese} serve --port 8080`, { cwd });