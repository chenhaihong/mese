
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');

const mese = path.resolve(__dirname, '../mese');
const cwd = path.resolve(__dirname, '../../example');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

jest.setTimeout(20000);
test('mese-build should run well', (done) => {
  execSh(`node ${mese} build -d`, { cwd }, function (err) {
    expect(err).toBeNull();
    done();
  });
});

function removeDir() {
  fs.removeSync(path.join(cwd, 'dist'));
  fs.removeSync(path.join(cwd, 'node_modules'));
}