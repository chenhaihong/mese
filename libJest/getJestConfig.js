
module.exports = getJestConfig;

function getJestConfig(rootDir) {
  return {
    verbose: true, // 终端上详细地输出各个describe块信息下的test信息
    rootDir, // 待测试项目的根目录
    setupFiles: [
      require.resolve('./setup/shim.js'), // polyfill
      require.resolve('./setup/setupBrowser.js'), // 配置浏览器的变量
      require.resolve('./setup/setupEnzyme.js'), // 配置enzyme的adapter
    ],
    resolver: require.resolve('jest-pnp-resolver'),
    transform: {
      '\\.jsx?$': require.resolve('./transformers/jsTransformer'),
      '\\.svg$': require.resolve('./transformers/fileTransformer'),
    },
    transformIgnorePatterns: [
      'node_modules'
    ],
    testMatch: ['**/?*.(spec|test).js?(x)'], // 不会测试test.js，*.test.js、*.spec.js才符合测试要求
    moduleFileExtensions: ['js', 'jsx', 'json'],
    moduleNameMapper: {
      '\\.(css|less)$': require.resolve('identity-obj-proxy'),
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        require.resolve('./mockers/fileMocker.js'),
    },
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverage: true, // 是否收集测试时的覆盖率信息
    collectCoverageFrom: [ // 哪些文件需要收集覆盖率信息
      '<rootDir>/**/*.{js,jsx}'
    ],
    coverageDirectory: '<rootDir>/coverage', // 输出覆盖信息文件的目录
    coveragePathIgnorePatterns: [ // 统计覆盖信息时需要忽略的文件
      '/node_modules/',
      '<rootDir>/mese.config.js'
    ],
  };
}