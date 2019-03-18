/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const opn = require('opn');
const ReactDOMServer = require('react-dom/server');

module.exports = function ({ index, manifest, staticDir, port, open, callback }) {
  const app = express();
  app.use(logger('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // 静态资源服务
  app.use(express.static(staticDir, {
    maxAge: '355d' // 355天浏览器缓存
  }));

  app.get('/', function (req, res) {
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0'
    });
    res.send(getHTML(index, staticDir, manifest));
  });

  app.get('/:page', function (req, res, next) {
    const page = req.params.page;
    if (hasPage(page, manifest)) {
      res.set({
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0'
      });
      return res.send(getHTML(page, staticDir, manifest));
    }
    next();
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    err.status === 404
      ? res.send(getHTML('404', staticDir, manifest))
      : res.send(getHTML('500', staticDir, manifest));
  });

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', (error) => { onError(error, port); });
  server.on('listening', function () {
    const port = server.address().port;
    console.log(`[Mese] Listening on port ${port}`);
    open && opn(`http://localhost:${port}`);
    callback && callback(server);
  });
};

/**
 * 获取指定页面的html内容
 * @param {String} name 页面的名称
 * @param {String} staticDir 存放静态资源的目录
 * @param {Object} manifest manifest.json中的json数据
 * @returns {String} 页面的html字符串
 */
function getHTML(name, staticDir, manifest) {
  let cache = getHTML.cache.get(name);
  if (cache) return cache;

  const rf = getRelativeFiles(name, staticDir, manifest);
  const application = require(rf.node).default;
  cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <title>Hello home!</title>
  <link rel="stylesheet" href="${rf.css}">
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(application)}</div>
  <script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>
  <script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>
  <script src="${rf.js}"></script>
  <script>
    ReactDOM.hydrate(Mese${name}.default, document.getElementById('root'));
  </script>
</body>
</html>`;

  getHTML.cache.set(name, cache);
  return cache;
}
getHTML.cache = new Map();

/**
 * 获取指定页面的关联文件
 * @param {String} name 页面的名称
 * @param {String} staticDir 存放静态资源的目录
 * @param {Object} manifest manifest.json中的json数据
 * @returns {Object} 关联的文件
 */
function getRelativeFiles(name, staticDir, manifest) {
  return {
    js: manifest[`${name}.js`],
    css: manifest[`${name}.css`],
    node: path.join(staticDir, `${name}.server.js`)
  };
}

/**
 * 包含这个页面[name]的结果
 * @param {String} name 页面的名称
 * @param {Object} manifest manifest.json中的json数据
 * @returns {Boolean} 是否包含指定页面的结果
 */
function hasPage(name, manifest) {
  let pages = hasPage.pages;
  if (!pages) {
    pages = new Set();
    const keys = Object.keys(manifest);
    keys.forEach(item => { // item example: home.js home.css
      const name = item.split('.')[0];
      pages.add(name);
    });
    hasPage.pages = pages;
  }
  return pages.has(name);
}
hasPage.pages = null;

/**
 * 监听http错误
 * @param {Error} error 错误
 * @param {Number} port 端口号码
 * @returns {void}
 */
function onError(error, port) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

