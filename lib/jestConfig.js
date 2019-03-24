const transformIgnorePatterns = [
  '/dist/',
  'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
];

module.exports = {
  verbose: true,
  rootDir: process.cwd(),
  // setupFiles: ['./__test__/setup.js'],
  // testPathIgnorePatterns: ['/node_modules/'],
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   "**/*.{js,jsx}",
  //   "!**/node_modules/**",
  //   "!**/vendor/**",
  //   "!mese.config.js"
  // ],
  // coveragePathIgnorePatterns: [
  //   '/node_modules/'
  // ],
  transformIgnorePatterns,
};