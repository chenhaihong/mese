const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const MarkupMaker = require("./MarkupMaker");

class ExpressMaker {
  /**
   * 构造方法
   * @param {Preparer} preparer 预备器
   */
  constructor(preparer) {
    this.app = express();
    this.preparer = preparer;
    this.markupMaker = new MarkupMaker();
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
    // 1 for logging tiny messages
    app.use(logger("tiny"));
    // 2 for parsing application/json
    app.use(express.json());
    // 3 for parsing application/x-www-form-urlencoded
    //   parse the URL-encoded data with the querystring library (when false)
    //   parse the URL-encoded data with the qs library (when true).
    app.use(express.urlencoded({ extended: false }));
    // 4 for parsing cookie
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
    const { app, preparer, markupMaker } = this;
    // 首页
    app.get("/", function (req, res, next) {
      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      const pascalCasePageName = preparer.getPascalCasePageNameOfIndex();
      const associatedFiles = preparer.getAssociatedFiles(pascalCasePageName);
      const htmlString = markupMaker.makeString(
        pascalCasePageName,
        associatedFiles
      );
      res.send(htmlString);
    });
  }

  _usePages() {
    const { app, preparer, markupMaker } = this;
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
      const htmlString = markupMaker.makeString(
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
    const { app, preparer, markupMaker } = this;
    app.use(function (err, req, res, next) {
      const { status = 500 } = err;
      const pascalCasePageName =
        status === 404
          ? preparer.getPascalCasePageNameOf404()
          : preparer.getPascalCasePageNameOf500();
      const associatedFiles = preparer.getAssociatedFiles(pascalCasePageName);
      const htmlString = markupMaker.makeString(
        pascalCasePageName,
        associatedFiles
      );
      res.send(htmlString);
    });
  }
}
module.exports = ExpressMaker;
