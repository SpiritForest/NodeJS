const process = require('process');
const Validator = require('./validator');
const getOptions = require('./options');
const pipeline = require('./pipeline');

const validator = new Validator();

function modifyData() {
  const options = getOptions();

  Promise.all([
    validator.isMandatoryParamsFilled(options),
    validator.isFileExists(options.input),
    validator.isFileExists(options.output),
  ])
    .then(() => {
      pipeline();
    })
    .catch((err) => {
      process.stderr.write('An error occured while data modifying \n', err);
    });
}

modifyData();
