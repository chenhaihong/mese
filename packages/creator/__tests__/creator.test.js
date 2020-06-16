/*global afterAll test:true*/

const { join } = require("path");
const fse = require("fs-extra");
const MeseCreator = require("..");

const dirTarget = join(__dirname, "..", "dirToCreate");

afterAll(() => {
  fse.removeSync(dirTarget);
});

describe("@mese/creator", () => {
  test("必须包含这些属性", () => {
    expect(MeseCreator).toHaveProperty("create");
  });

  test("MeseCreator.create", (done) => {
    MeseCreator.create(dirTarget, function () {
      // TODO 用的fs-extra的copy方法，所以改成mock方式进行测试，判断方法有调用就好了
      // 偷懒测试，没有做检测文件的逻辑
      done();
    });
  });
});
