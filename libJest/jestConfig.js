const transformIgnorePatterns = [
  '/dist/',
  'node_modules/[^/]+?/(?!(es|node_modules)/)', // Ignore modules without es dir
];

module.exports = {
  verbose: true,
  rootDir: process.cwd(),
  // setupFiles: ['./__test__/setup.js'],
  // testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true, // 是否收集测试时的覆盖率信息
  collectCoverageFrom: [ // 哪些文件需要收集覆盖率信息
    "<rootDir>/**/*.{js,jsx}"
  ],
  coverageDirectory: '<rootDir>/test/coverage', // 输出覆盖信息文件的目录
  coveragePathIgnorePatterns: [ // 统计覆盖信息时需要忽略的文件
    "**/node_modules/**",
    "**/vendor/**",
    "<rootDir>/mese.config.js"
  ],
  setupFiles: ['<rootDir>/__test__/setup.js'], // 运行测试前可运行的脚本，这里用来注册enzyme的兼容
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(css|less)$': '<rootDir>/test/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/fileTransform.js',
  },
  transformIgnorePatterns,
};