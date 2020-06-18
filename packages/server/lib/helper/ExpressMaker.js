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
      express.static(preparer.browserAppDir, {
        maxAge: "355d", // 355天浏览器缓存
      })
    );
  }

  _useIndex() {
    const { app, preparer, markupMaker } = this;
    // 首页
    app.get("/", async function (req, res) {
      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      const pascalCasePageName = preparer.getPascalCasePageNameOfIndex();
      const options = {
        associatedFiles: preparer.getAssociatedFiles(pascalCasePageName),
        path: req.path,
        query: req.query,
      };
      const htmlString = await markupMaker.makeString(
        pascalCasePageName,
        options
      );
      res.send(htmlString);
    });
  }

  _usePages() {
    const { app, preparer, markupMaker } = this;
    // 其他静态页面
    app.use(async function pagesHandler(req, res, next) {
      const { path } = req;
      if (!preparer.hasPagePath(path)) {
        return next();
      }

      res.set({
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=0",
      });
      const pascalCasePageName = preparer.getPascalCasePageName(path);
      const options = {
        associatedFiles: preparer.getAssociatedFiles(pascalCasePageName),
        path: req.path,
        query: req.query,
      };
      const htmlString = await markupMaker.makeString(
        pascalCasePageName,
        options
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

      try {
        typeof result === "function"
          ? res.json(await result(req, res, next))
          : res.json(result);
      } catch (error) {
        next(error);
      }
    });
  }

  _use404() {
    // catch 404
    const { app, preparer, markupMaker } = this;
    app.use(async function notFoundHandler(req, res, next) {
      const pascalCasePageName = preparer.getPascalCasePageNameOf404();
      const options = {
        associatedFiles: preparer.getAssociatedFiles(pascalCasePageName),
        path: req.path,
        query: req.query,
      };
      const htmlString = await markupMaker.makeString(
        pascalCasePageName,
        options
      );
      res.status(404);
      res.send(htmlString);
    });
  }

  _useError() {
    // error handler
    const { app, preparer, markupMaker } = this;
    app.use(async function errorHandler(err, req, res, next) {
      const pascalCasePageName = preparer.getPascalCasePageNameOf500();
      const options = {
        associatedFiles: preparer.getAssociatedFiles(pascalCasePageName),
        path: req.path,
        query: req.query,
        error: { message: err.message, stack: err.stack },
      };
      const htmlString = await markupMaker.makeString(
        pascalCasePageName,
        options
      );
      res.status(500);
      res.send(htmlString);
    });
  }
}
module.exports = ExpressMaker;
