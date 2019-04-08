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

module.exports = function ({ index, apiFiles, manifest, staticDir, port, success, fail }) {
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

  // 为app添加指定自定义的api服务
  addApis(app, apiFiles);

  // 首页
  app.get('/', function (req, res, next) {
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0'
    });
    res.send(getHTML(index));
  });

  //  其他静态页面
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
 * 为app添加指定自定义的api服务
 * @param {Object} app express服务实例
 * @param {Array} apiFiles api文件数组
 * @returns {void}
 */
function addApis(app, apiFiles) {
  apiFiles.forEach((file) => {
    const apis = require(file);
    for (const path in apis) {
      if (!apis.hasOwnProperty(path)) continue;
      let { method, result } = apis[path];
      app[method](path, async function (req, res, next) {
        typeof result === 'function'
          ? res.json(await result(req, res))
          : res.json(result);
      });
    }
  });
}

/**
 * 获取指定页面的html内容
 * @param {String} name 页面的名称
 * @returns {String} 页面的html字符串
 */
function getHTML(name) {
  let cache = getHTML.cache.get(name);
  if (cache) return cache;

  const { js, css, node } = getRelativeFiles(name);
  const { default: application, pageConfig } = require(node);
  const {
    beforePageCSS, afterPageCSS, beforePageJs, afterPageJs
  } = formatPageConfig(pageConfig);
  cache = `<!DOCTYPE html>
<html lang="zh">
<head>
  ${beforePageCSS}
  <link rel="stylesheet" href="${css}">
  ${afterPageCSS}
</head>
<body>
  <div id="root">${ReactDOMServer.renderToStaticMarkup(application)}</div>
  ${beforePageJs}
  <script src="${js}"></script>
  ${afterPageJs}
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
 * 格式化当前页面的配置对象
 * @param {Object|null} pageConfig 当前页面的配置对象
 * @returns {Object} 一个格式化后的配置对象
 */
function formatPageConfig(pageConfig) {
  let beforePageCSS = '',
    afterPageCSS = '',
    beforePageJs = '',
    afterPageJs = '';
  if (pageConfig) {
    const { head = {}, body = {} } = pageConfig;
    beforePageCSS = head.beforePageCSS || '';
    afterPageCSS = head.afterPageCSS || '';
    beforePageJs = body.beforePageJs || '';
    afterPageJs = body.afterPageJs || '';
  }
  return { beforePageCSS, afterPageCSS, beforePageJs, afterPageJs };
}

/**
 * 获取指定页面的关联文件
 * @param {String} name 页面的名称
 * @returns {Object} 关联的文件
 */
function getRelativeFiles(name) {
  return {
    js: '/' + _manifest[`${name}.js`],
    css: '/' + _manifest[`${name}.css`],
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
