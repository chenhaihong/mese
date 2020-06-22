/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require("http");

const Preparer = require("./helper/Preparer");
const ExpressMaker = require("./helper/ExpressMaker");

class Server {
  constructor({ meseAppDir, host, port, success, fail }) {
    const preparer = new Preparer(meseAppDir);
    preparer.checkIsAllReadyOtherwiseExit();

    const app = new ExpressMaker(preparer).make();
    const server = http.createServer(app);
    server.on("listening", function () {
      success && success(port);
    });
    server.on("error", (error) => {
      fail && fail(error);
    });
    const options = { host, port };
    server.listen(options);

    return server;
  }

  static startUpSuccessfully(port) {
    console.log(`[Mese] Listening on port ${port}`);
  }

  static startUpUnsuccessfully(e) {
    if (e.syscall !== "listen") {
      throw e;
    }

    const bind = "[Mese] Port " + port;

    // handle specific listen errors with friendly messages
    switch (e.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw e;
    }
  }
}

module.exports = Server;
