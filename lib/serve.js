const path = require('path');
const express = require('express');
const fse = require('fs-extra');
const opn = require('opn');
const ReactDOMServer = require('react-dom/server');
const constants = require('./constants');
const app = express();

module.exports = (port, open) => {
  // 静态资源服务
  app.use(express.static(path.resolve(process.cwd(), constants.dist), {
    maxAge: '1d' // 1天浏览器缓存
  }));

  app.get('/', function (req, res) {
    const home = getHome();
    res.send(getHTML(home));
  });

  app.get('/:page', function (req, res, next) {
    const page = req.params.page;
    if (hasPage(page)) {
      return res.send(getHTML(page));
    }
    next();
  });

  // 监听端口，启动服务
  app.listen(port, function () {
    console.log(`[Mese] Enabled web server listening on port ${port}`);
    open && opn('http://localhost:8080');
  });
};

/**
 * 获取首页名称
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
 * 获取指定页面关联的文件
 * @param {String} name 页面的名称
 */
function getRelativeFiles(name) {
  const manifest = getManifest();
  return {
    css: manifest[`${name}.css`],
    js: manifest[`${name}.js`]
  };
}

/**
 * 包含这个页面
 * @param {String} name 页面的名称
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