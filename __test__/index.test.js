/*global expect test:true*/

const mese = require('..');

test('mese should have desired properties', () => {
  expect(mese).toHaveProperty('serve');
});