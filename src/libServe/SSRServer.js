/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ReactDOMServer = require('react-dom/server');
const compatibleRequire = require('./helper/compatibleRequire');

module.exports = SSRServer;

class SSRServer {
  /**
   * ssr服务构造方法
   * 
   * @param {Object}   opts
   * @param {String}   [opts.index]            首页名称
   * @param {Array}    [opts.apiFiles]         
   * @param {Object}   [opts.manifest]         
   * @param {String}   [opts.staticDir='dist'] 
   * @param {Number}   [opts.port=3000]        
   * @param {Function} [opts.success=null]     
   * @param {Function} [opts.fail=null]        
   * 
   * @returns {void} 
   */
  constructor() {
    const app = express();

    app.use(logger('tiny'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    this.app = app;
  }

  useStaticPages(staticDir, homepageName) {
    // 静态资源服务
    this.app.use(express.static(staticDir, {
      maxAge: '355d' // 355天浏览器缓存
    }));

    // 首页
    this.app.get('/', function (req, res, next) {
      res.set({
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0'
      });
      res.send(getHTML(homepageName));
    });

    //  其他静态页面
    this.app.get('/:pagename', function (req, res, next) {
      const pagename = req.params.pagename;
      if (hasPage(pagename)) {
        res.set({
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0'
        });
        return res.send(getHTML(pagename));
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
  useApis(apiFiles) {
    apiFiles.forEach(file => {
      const apis = compatibleRequire(file); // Critical dependency: the request of a dependency is an expression
      for (const path in apis) {
        if (!apis.hasOwnProperty(path)) continue;
        const { method, result } = apis[path];
        this.app[method](path, async function (req, res, next) {
          typeof result === 'function'
            ? res.json(await result(req, res))
            : res.json(result);
        });
      }
    });
  }

  use404AndErrorMiddleware() {
    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      err.status === 404
        ? res.send(getHTML('404'))
        : res.send(getHTML('500'));
    });
  }

  on(success, fail) {
    const server = http.createServer(this.app);
    server.listen(port);
    server.on('error', (error) => {
      fail && fail(error);
    });
    server.on('listening', function () {
      success && success(server);
    });
  }
}
