const mese = require('../index');

test('mese has desired properties', () => {
  expect(mese).toHaveProperty('build');
  expect(mese).toHaveProperty('watch');
});