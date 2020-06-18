const { join } = require("path");
const MeseServer = require("../lib/Server");

const dirBoilerplate = join(
  __dirname,
  "../../../",
  "__temp_fixtures__/sc-mese-app"
);
const dirDist = join(dirBoilerplate, "dist-for-MeseServer");
const [meseAppDir, host, port] = [dirDist, "127.0.0.1", "3000"];

const server = new MeseServer({
  meseAppDir,
  host,
  port,
  success: MeseServer.startUpSuccessfully,
  fail: MeseServer.startUpUnsuccessfully,
});
