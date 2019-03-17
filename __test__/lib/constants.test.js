/*global expect test:true*/

const constants = require('../../lib/constants');

test('constants should have desired properties', () => {
  expect(constants).toHaveProperty('mese');
  expect(constants).toHaveProperty('dist');
  expect(constants).toHaveProperty('manifest');
});