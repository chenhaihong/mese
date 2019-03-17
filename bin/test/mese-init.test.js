
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');

const mese = path.resolve(__dirname, '../mese');
const dir = path.join(__dirname, 'dirToInit');

beforeEach(() => {
  removeDir();
});

afterEach(() => {
  removeDir();
});

test('init should run well', (done) => {
  execSh(`node ${mese} init -d ${dir}`, function (err) {
    expect(err).toBeNull();
    done();
  });
});

function removeDir() {
  fs.removeSync(dir);
}