const { join } = require("path");
const Server = require("@mese/server");

const [meseAppDir, host, port] = [join(__dirname, "dist"), "127.0.0.1", "3000"];

new Server({
  meseAppDir,
  host,
  port,
  success: Server.startUpSuccessfully,
  fail: Server.startUpUnsuccessfully,
});
