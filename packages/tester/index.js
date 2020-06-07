
module.exports = test;

/**
 * 测试指定目录的文件
 * @param {Object} options 包含工作目录cwd的对象
 * @returns {Promise} 一个jest执行结果的Promise对象
 */
function test(options) {
  const { cwd } = options;
  const jestConfig = require('./getJestConfig')(cwd);

  return new Promise((resolve, reject) => {
    require('jest')
      .runCLI(
        {
          config: JSON.stringify(jestConfig),
          runInBand: true,
        },
        [cwd],
      )
      .then(result => {
        const { results } = result;
        if (results.success) {
          resolve(true);
        } else {
          reject(new Error('Jest failed'));
        }
      })
      .catch(e => {
        console.log(e); // eslint-disable-line
      });
  });
}