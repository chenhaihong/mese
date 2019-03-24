
module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js',
    'lib/**/*.js',
    'bin/**/*'
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
  ]
};