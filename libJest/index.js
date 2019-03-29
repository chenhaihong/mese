
module.exports = test;

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
        console.log(e);
      });
  });
}