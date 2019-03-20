const transformIgnorePatterns = [
  '/dist/',
  'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
];

module.exports = {
  verbose: true,
  // setupFiles: ['./__test__/setup.js'],
  // testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    'bin/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'coverage',
    'dirToBuild',
    'dirToInit',
    'dirToServe',
    'dirToWatch',
    'dirToMese',
    'dirToGetWebpackConfig',
    'dist'
  ],
  transformIgnorePatterns,
};