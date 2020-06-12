const { resolve } = require("path");
const fse = require("fs-extra");

module.exports = async () => {
  const root = resolve(__dirname, "..", "..");
  const dirTemp = resolve(root, "__temp_fixtures__");
  const dirBoilerplate = resolve(root, "packages/create", "boilerplate");

  fse.emptyDirSync(dirTemp);
  fse.copySync(dirBoilerplate, dirTemp);
};
