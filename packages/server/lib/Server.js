/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require("http");

const Preparer = require("./helper/Preparer");
const ExpressMaker = require("./helper/ExpressMaker");

class Server {
  constructor({ meseConfigUrl, staticDir, host, port, success, fail }) {
    Preparer.checkIsAllReadyOtherwiseExit(meseConfigUrl, staticDir);

    const app = new ExpressMaker({
      indexName: Preparer.getIndexName(meseConfigUrl),
      apiFiles: Preparer.getApiFiles(meseConfigUrl),
      manifest: Preparer.getManifest(staticDir),
      staticDir,
    }).make();
    const server = http.createServer(app);
    server.on("error", (error) => {
      fail && fail(error);
    });
    server.on("listening", function () {
      success && success(port);
    });
    const options = { port, host };
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

    const bind = "Port " + port;

    // handle specific listen errors with friendly messages
    switch (e.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      // break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      // break;
      default:
        throw e;
    }
  }
}

module.exports = Server;
