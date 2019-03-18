/*global beforeEach afterEach test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');

const mese = path.resolve(__dirname, '../../bin/mese');
const dir = path.join(__dirname, 'dirToInit');

afterAll(() => {
  fs.removeSync(dir);
});

test('mese-init should run well', (done) => {
  expect.assertions(1);
  execSh(`node ${mese} init -d ${dir}`, function (err) {
    expect(err).toBeNull();
    done();
  });
});
