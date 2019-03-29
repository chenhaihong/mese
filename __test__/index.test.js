/*global expect test:true*/

const mese = require('..');

test('mese should have desired properties', () => {
  expect(mese).toHaveProperty('init');
  expect(mese).toHaveProperty('build');
  expect(mese).toHaveProperty('watch');
  expect(mese).toHaveProperty('serve');
  expect(mese).toHaveProperty('test');
  expect(mese).toHaveProperty('getWebpackConfig');
});