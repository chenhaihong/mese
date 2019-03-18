/*global beforeEach afterEach jest test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
// const fs = require('fs-extra');
const init = require('../../lib/init');

const dir = path.join(__dirname, 'dirToWatch');
const mese = path.resolve(__dirname, '../../bin/mese');

beforeAll(() => {
  // fs.removeSync(dir);
  init(dir, () => { });
});

// Error: EBUSY: 
//  resource busy or locked, 
//  rmdir 'F:\WWW\mese\__test__\bin\dirToWatch'
// afterAll(() => {
//   fs.removeSync(dir);
// });

jest.setTimeout(20000);
test('mese-watch should run well', (done) => {
  expect.assertions(1);
  const child = execSh(`node ${mese} watch -d`, { cwd: dir }, function (err) {
    expect(err).toBeNull();
    done();
  });
  setTimeout(function () {
    child.kill();
  }, 6000);
});