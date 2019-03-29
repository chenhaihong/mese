const { JSDOM } = require('jsdom');

// fixed jsdom miss
const documentHTML = `
<!doctype html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>`;
const dom = new JSDOM(documentHTML);
global.window = dom.window; // window.alert is not implemented.
global.document = dom.window.document;
global.navigator = global.window.navigator;