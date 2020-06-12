/*global afterAll test:true*/

const { join } = require("path");
const { emptyDirSync } = require("fs-extra");
const meseCreate = require("../lib");

const dirTarget = join(__dirname, "..", "dirToCreate");

afterAll(() => {
  emptyDirSync(dirTarget);
});

test("@mese/create", (done) => {
  meseCreate(dirTarget, function () {
    // TODO 用的fs-extra的copy方法，所以改成mock方式进行测试，判断方法有调用就好了
    // 偷懒测试，没有做检测文件的逻辑
    done();
  });
});
