/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ReactDOMServer = require('react-dom/server');

let _manifest = null, _staticDir = null;

module.exports = function ({ index, manifest, staticDir, port, success, fail }) {
  _manifest = manifest, _staticDir = staticDir;

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
    res.send(getHTML(index));
  });

  app.get('/:page', function (req, res, next) {
    const page = req.params.page;
    if (hasPage(page)) {
      res.set({
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0'
      });
      return res.send(getHTML(page));
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
      ? res.send(getHTML('404'))
      : res.send(getHTML('500'));
  });

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', (error) => {
    fail && fail(error);
  });
  server.on('listening', function () {
    success && success(server);
  });
};

/**
 * 获取指定页面的html内容
 * @param {String} name 页面的名称
 * @returns {String} 页面的html字符串
 */
function getHTML(name) {
  let cache = getHTML.cache.get(name);
  if (cache) return cache;

  const { js, css, node } = getRelativeFiles(name);
  const application = require(node).default;
  cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <title>Hello home!</title>
  <link rel="stylesheet" href="${css}">
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(application)}</div>
  <script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>
  <script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>
  <script src="${js}"></script>
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
 * @returns {Object} 关联的文件
 */
function getRelativeFiles(name) {
  return {
    js: _manifest[`${name}.js`],
    css: _manifest[`${name}.css`],
    node: path.join(_staticDir, `${name}.server.js`)
  };
}

/**
 * 包含这个页面[name]的结果
 * @param {String} name 页面的名称
 * @returns {Boolean} 是否包含指定页面的结果
 */
function hasPage(name) {
  let pages = hasPage.pages;
  if (!pages) {
    pages = new Set();
    const keys = Object.keys(_manifest);
    keys.forEach(item => { // item example: home.js home.css
      const name = item.split('.')[0];
      pages.add(name);
    });
    hasPage.pages = pages;
  }
  return pages.has(name);
}
hasPage.pages = null;
