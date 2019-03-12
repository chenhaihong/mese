const path = require('path');
const express = require('express');
const fse = require('fs-extra');
const ReactDOMServer = require('react-dom/server');
const constants = require('./constants');
const app = express();

module.exports = (port) => {
  // 静态资源服务
  app.use(express.static(path.resolve(process.cwd(), constants.dist), {
    maxAge: '1d' // 1天浏览器缓存
  }));

  app.get('/:name', function (req, res, next) {
    const html = getHTML(req.params.name);
    res.send(html);
  });

  // 监听端口，启动服务
  app.listen(port, function () {
    console.log(`[Mese] Enabled web server listening on port ${port}`);
  });
};

/**
 * 获取指定页面的html内容
 * @param {String} name 页面的名称
 */
function getHTML(name) {
  let cache = getHTML.cache.get(name);
  if (cache) return cache;

  const relativeFiles = getRelativeFiles(name);
  const serverJsPath = path.resolve(process.cwd(), constants.dist, `${name}.server.js`);
  console.log(relativeFiles, serverJsPath)
  const application = require(serverJsPath);
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
  console.log(name)
  let manifest = getRelativeFiles.manifest;
  if (!manifest) {
    const url = path.join(process.cwd(), constants.dist, constants.manifest);
    if (!fse.pathExistsSync(url)) {
      console.log('[Mese] mess.js not found.');
      process.exit(-1);
    }
    manifest = require(url);
  }
  console.log(manifest)
  return {
    css: manifest[`${name}.css`],
    js: manifest[`${name}.js`]
  };
}
getRelativeFiles.cache = null;