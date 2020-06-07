/*global afterAll test:true*/

const { join } = require("path");
const { removeSync } = require("fs-extra");
const meseCreate = require("../lib");

const dirTarget = join(__dirname, "..", "dirToCreate");

afterAll(() => {
  removeSync(dirTarget);
});

test("@mese/create", (done) => {
  meseCreate(dirTarget, function () {
    done();
  });
});
