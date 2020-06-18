/*global afterAll test:true*/

const path = require("path");
const fse = require("fs-extra");
const minimist = require("minimist");

const [lastCwd, currCwd, dirCustomed] = [
  process.cwd(),
  path.join(__dirname, "..", "dirToCreate"),
  minimist(process.argv.slice(2))._[0] || "",
];
const [dirSourceCode, dirTarget] = [
  path.join(__dirname, "..", "boilerplate-sc-mese-app"),
  path.join(currCwd, dirCustomed),
];

beforeAll(() => {
  // 临时工作空间，用来测试拷贝功能，存放拷贝的源码
  fse.ensureDirSync(currCwd);
  process.chdir(currCwd);
});

afterAll(() => {
  process.chdir(lastCwd);
  fse.emptyDirSync(currCwd);
});

describe("@mese/create-sc-mese-app", () => {
  test("拷贝过程应该正常进行", (done) => {
    const join = jest.spyOn(path, "join");
    const copySync = jest.spyOn(fse, "copySync");

    require("..");

    expect(join).toHaveBeenCalled();

    // 验证拷贝
    expect(copySync).toHaveBeenCalledTimes(1);
    // 验证拼接路径 dirSourceCode
    expect(copySync.mock.calls[0][0]).toBe(dirSourceCode);
    // 验证拼接路径 dirTarget
    expect(copySync.mock.calls[0][1]).toBe(dirTarget);

    done();
  });
});
