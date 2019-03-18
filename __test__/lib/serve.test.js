/*global expect test:true*/

const path = require('path');
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
const serve = require('../../lib/serve');

let server;
beforeAll(() => {
  return new Promise(resolve => {
    const index = 'home';
    const manifest = require(path.join(__dirname, '../../example/dist/manifest.json'));
    const staticDir = path.join(__dirname, '../../example/dist');
    const port = 3000;
    const open = false;
    const callback = (_server) => {
      server = _server;
      resolve(server);
    };
    serve({ index, manifest, staticDir, port, open, callback });
  });
});

afterAll(() => {
  server.close();
});

describe('serve should run well', () => {
  test('get / should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:3000', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/Hello home!/);
  });

  test('get /:page should run well', async () => {
    expect.assertions(2);
    const res = await axios.get('http://localhost:3000/home', { adapter });
    expect(res.status).toBe(200);
    expect(res.data).toMatch(/Hello home!/);
  });

  test('get page-unknown should run well', async () => {
    expect.assertions(2);
    try {
      await axios.get('http://localhost:3000/unknown', { adapter });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatch(/404/);
    }
  });
});