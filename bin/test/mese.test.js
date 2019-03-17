
const path = require('path');
const execSh = require('exec-sh');

const mese = path.resolve(__dirname, '../mese');
const cwd = path.resolve(__dirname, '../../example');

describe('"mese" should run well', () => {
  test('"mese" should run well', (done) => {
    execSh(`node ${mese}`, { cwd }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  test('"mese -v" should run well', (done) => {
    execSh(`node ${mese} -v`, { cwd }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });

  test('"mese -h" should run well', (done) => {
    execSh(`node ${mese} -h`, { cwd }, function (err) {
      expect(err).toBeNull();
      done();
    });
  });
});