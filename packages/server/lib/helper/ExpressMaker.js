const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const HtmlMaker = require("./HtmlMaker");
const compatibleRequire = require("./compatibleRequire");

class ExpressMaker {
  /**
   * 构造方法
   *
   * @param {Object}   options
   * @param {String}   [options.indexName]
   * @param {Array}    [options.apiFiles]
   * @param {Object}   [options.manifest]
   * @param {String}   [options.staticDir='dist']
   */
  constructor(options) {
    this.app = express();
    this.options = options;
  }

  make() {
    this._useDefault();
    this._useStatic();
    this._useHome();
    this._usePages();
    this._useApis();
    this._use404();
    this._useError();

    return this.app;
  }

  _useDefault() {
    const app = this.app;
    app.use(logger("tiny"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
  }

  _useStatic(staticDir) {
    // 1 静态资源服务
    this.app.use(
      express.static(staticDir, {
        maxAge: "355d", // 355天浏览器缓存
      })
    );
  }

  _useHome(homePageName) {
    // 首页
    this.app.get("/", function (req, res, next) {
      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      res.send(HtmlMaker.makeHtmlString(homePageName));
    });
  }

  _usePages() {
    const app = this.app;
    // 其他静态页面
    app.get("/:pagename", function (req, res, next) {
      const pagename = req.params.pagename;
      if (hasPage(pagename)) {
        res.set({
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=0",
        });
        return res.send(HtmlMaker.makeHtmlString(pagename));
      }
      next();
    });
  }

  /**
   * 为app添加指定自定义的api服务
   *
   * @param {Array} apiFiles api文件数组，存放的是相对路径。
   *
   * @returns {void}
   */
  _useApis(apiFiles) {
    apiFiles.forEach((file) => {
      const apis = compatibleRequire(file); // Critical dependency: the request of a dependency is an expression
      for (const path in apis) {
        if (!apis.hasOwnProperty(path)) continue;
        const { method, result } = apis[path];
        this.app[method](path, async function (req, res, next) {
          typeof result === "function"
            ? res.json(await result(req, res))
            : res.json(result);
        });
      }
    });
  }

  _use404() {
    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  }

  _useError() {
    // error handler
    this.app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      err.status === 404
        ? res.send(HtmlMaker.makeHtmlString("404"))
        : res.send(HtmlMaker.makeHtmlString("500"));
    });
  }
}
module.exports = ExpressMaker;
