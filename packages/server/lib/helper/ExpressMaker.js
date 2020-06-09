const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const MarkupMaker = require("./MarkupMaker");
const compatibleRequire = require("./compatibleRequire");

class ExpressMaker {
  /**
   * 构造方法
   * @param {Preparer} preparer 预备器
   */
  constructor(preparer) {
    this.app = express();
    this.preparer = preparer;
  }

  make() {
    this._useDefault();
    this._useStatic();
    this._useIndex();
    this._usePages();
    this._useApis();
    this._use404();
    this._useError();

    return this.app;
  }

  _useDefault() {
    const { app } = this;
    app.use(logger("tiny"));
    app.use(express.json()); // for parsing application/json
    // for parsing application/x-www-form-urlencoded
    // parse the URL-encoded data with
    //    the querystring library (when false)
    //    or the qs library (when true).
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
  }

  _useStatic() {
    const { app, preparer } = this;
    // 1 静态资源服务
    app.use(
      express.static(preparer.meseAppDir, {
        maxAge: "355d", // 355天浏览器缓存
      })
    );
  }

  _useIndex() {
    const { app, preparer } = this;
    // 首页
    app.get("/", function (req, res, next) {
      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      const pascalCasePageName = preparer.getPascalCasePageNameOfIndex();
      const associatedFiles = preparer.getAssociatedFiles(pascalCasePageName);
      const htmlString = MarkupMaker.makeString(
        pascalCasePageName,
        associatedFiles
      );
      res.send(htmlString);
    });
  }

  _usePages() {
    const { app, preparer } = this;
    // 其他静态页面
    app.use(function pagesHandler(req, res, next) {
      const { path } = req;
      if (!preparer.hasRoutePath(path)) {
        return next();
      }

      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      const pascalCasePageName = preparer.getPascalCasePageName(path);
      const associatedFiles = preparer.getAssociatedFiles(pascalCasePageName);
      const htmlString = MarkupMaker.makeString(
        pascalCasePageName,
        associatedFiles
      );
      res.send(htmlString);
    });
  }

  /**
   * 为app添加用户自定义的api服务
   */
  _useApis() {
    const { app, preparer } = this;
    const apiMap = preparer.getApiMap();
    app.use(async function apiHandler(req, res, next) {
      if (!apiMap.has(req.path)) {
        return next();
      }

      const { method, result } = apiMap.get(req.path);
      if (req.method.toLocaleLowerCase() !== method.toLocaleLowerCase()) {
        return next();
      }

      typeof result === "function"
        ? res.json(await result(req, res, next))
        : res.json(result);
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
      const { status = 500 } = err;
      const pascalCasePageName = status === 404 ? "404" : "500";
      const associatedFiles = preparer.getAssociatedFiles(pascalCasePageName);
      const htmlString = MarkupMaker.makeString(
        pascalCasePageName,
        associatedFiles
      );
      res.send(htmlString);
    });
  }
}
module.exports = ExpressMaker;
