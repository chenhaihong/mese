/*global beforeAll afterAll describe expect test:true*/
const path = require('path');
const fse = require('fs-extra');
const init = require('../../lib/init');
const getConfig = require('../../lib/getWebpackConfig');

const dir = path.join(__dirname, 'dirToGetWebpackConfig');

beforeAll(() => {
  fse.removeSync(dir);
  init(dir, () => { });
});

afterAll(() => {
  fse.removeSync(dir);
});

describe('getWebpackConfig() should have desired properties', () => {
  const mode = 'development';
  const meseUrl = path.join(dir, 'mese.config.js');
  const outputPath = path.join(dir, 'dist');

  test('client config should have desired properties', () => {
    const config = getConfig(mode, meseUrl, outputPath);
    const clientConfig = config[0];
    expect(clientConfig).toHaveProperty('target');
    expect(clientConfig).toHaveProperty('mode');
    expect(clientConfig).toHaveProperty('devtool');
    expect(clientConfig).toHaveProperty('entry');

    expect(clientConfig).toHaveProperty('output');
    expect(clientConfig).toHaveProperty('module');
    expect(clientConfig).toHaveProperty('plugins');
    expect(clientConfig).toHaveProperty('resolve');

    expect(clientConfig).toHaveProperty('resolveLoader');
    expect(clientConfig).toHaveProperty('externals');
  });

  test('server config should have desired properties', () => {
    const config = getConfig(mode, meseUrl, outputPath);
    const serverConfig = config[1];
    expect(serverConfig).toHaveProperty('target');
    expect(serverConfig).toHaveProperty('mode');
    expect(serverConfig).toHaveProperty('devtool');
    expect(serverConfig).toHaveProperty('entry');

    expect(serverConfig).toHaveProperty('output');
    expect(serverConfig).toHaveProperty('module');
    expect(serverConfig).toHaveProperty('resolve');
    expect(serverConfig).toHaveProperty('resolveLoader');
  });
});