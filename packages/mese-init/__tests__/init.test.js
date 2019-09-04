/*global afterAll test:true*/

const path = require("path");
const fse = require("fs-extra");
const meseInit = require("../lib");

const dir = path.join(__dirname, "dirToInit");

afterAll(() => {
  fse.removeSync(dir);
});

test("meseInit should run well", done => {
  meseInit(dir, function() {
    done();
  });
});
