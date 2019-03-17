/*eslint no-unused-vars: 0*/
/*eslint no-console: 0 */

const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fse = require('fs-extra');
const opn = require('opn');
const ReactDOMServer = require('react-dom/server');
const constants = require('./constants');

module.exports = function (port, open) {
  const app = express();
  app.use(logger('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // 静态资源服务
  app.use(express.static(path.resolve(process.cwd(), constants.dist), {
    maxAge: '355d' // 355天浏览器缓存
  }));

  app.get('/', function (req, res) {
    const home = getHome();
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0'
    });
    res.send(getHTML(home));
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
  server.on('error', (error) => { onError(error, port); });
  server.on('listening', function () {
    const port = server.address().port;
    console.log(`[Mese] Listening on port ${port}`);
    open && opn(`http://localhost:${port}`);
  });
};

/**
 * 获取首页的名称字符串
 * @returns {String} 首页文件的名称
 */
function getHome() {
  const pages = getMese().pages;
  if (!pages) {
    console.log('[Mese] pages not found.');
    process.exit(-1);
  }
  return path.parse(pages[0]).name;
}

/**
 * 获取mese配置信息
 * @returns {Object} mese配置对象
 */
function getMese() {
  let mese = getMese.cache;
  if (!mese) {
    const url = path.join(process.cwd(), constants.mese);
    if (!fse.pathExistsSync(url)) {
      console.log('[Mese] mess.js not found.');
      process.exit(-1);
    }
    mese = require(url);
    getMese.cache = mese;
  }
  return mese;
}
getMese.cache = null;

/**
 * 获取指定页面的html内容
 * @param {String} name 页面的名称
 * @returns {String} 页面的html字符串
 */
function getHTML(name) {
  let cache = getHTML.cache.get(name);
  if (cache) return cache;

  const relativeFiles = getRelativeFiles(name);
  const serverJsPath = path.resolve(process.cwd(), constants.dist, `${name}.server.js`);
  const application = require(serverJsPath).default;
  cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <title>Hello home!</title>
  <link rel="stylesheet" href="${relativeFiles.css}">
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(application)}</div>
  <script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>
  <script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>
  <script src="${relativeFiles.js}"></script>
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
 * 从manifest文件中，获取指定页面关联的文件
 * @param {String} name 页面的名称
 * @returns {Object} 页面的关联文件
 */
function getRelativeFiles(name) {
  const manifest = getManifest();
  return {
    css: manifest[`${name}.css`],
    js: manifest[`${name}.js`]
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
    const manifest = getManifest();
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
 * 获取manifest，如果有缓存返回缓存
 * @returns {Object} `dist/manifest.json`文件里的manifest对象
 */
function getManifest() {
  let manifest = getManifest.cache;
  if (!manifest) {
    const url = path.join(process.cwd(), constants.dist, constants.manifest);
    if (!fse.pathExistsSync(url)) {
      console.log('[Mese] manifest.json not found.');
      process.exit(-1);
    }
    manifest = require(url);
    getManifest.cache = manifest;
  }
  return manifest;
}
getManifest.cache = null;

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

