
module.exports = {
  verbose: true,
  setupFiles: [
    require.resolve('./__test__/cleanExample.js')
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js',
    'src/**/*.js',
    'bin/mese',
    'bin/mese',
    'bin/mese-init',
    'bin/mese-build',
    'bin/mese-watch',
    'bin/mese-test',
    'bin/mese-serve'
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