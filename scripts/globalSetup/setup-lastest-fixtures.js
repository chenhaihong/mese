const { resolve } = require("path");
const fse = require("fs-extra");

module.exports = async () => {
  const root = resolve(__dirname, "..", "..");
  const dirTemp = resolve(root, "__temp_fixtures__", "sc-mese-app");
  const dirBoilerplate = resolve(
    root,
    "packages/create-sc-mese-app",
    "boilerplate-sc-mese-app"
  );

  fse.emptyDirSync(dirTemp);
  fse.copySync(dirBoilerplate, dirTemp);
};
