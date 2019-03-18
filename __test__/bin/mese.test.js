/*global describe test expect:true*/
const path = require('path');
const execSh = require('exec-sh');
const fs = require('fs-extra');
const init = require('../../lib/init');

const dir = path.resolve(__dirname, 'dirToMese');
const mese = path.resolve(__dirname, '../../bin/mese');

beforeAll(() => {
  fs.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fs.removeSync(dir);
});

describe('"mese" should run well', () => {
  test('"mese" should run well', (done) => {
    expect.assertions(1);
    execSh(`node ${mese}`, { cwd: dir }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  test('"mese -v" should run well', (done) => {
    expect.assertions(1);
    execSh(`node ${mese} -v`, { cwd: dir }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  test('"mese -h" should run well', (done) => {
    expect.assertions(1);
    execSh(`node ${mese} -h`, { cwd: dir }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });
});