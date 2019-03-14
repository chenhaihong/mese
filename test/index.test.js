const mese = require('..');

test('mese should have desired properties', () => {
  expect(mese).toHaveProperty('build');
  expect(mese).toHaveProperty('watch');
  expect(mese).toHaveProperty('serve');
});