const Validator = function() {};
const fs = require('fs');

Validator.prototype.isActionAllowable = function (sAction, mParameters) {
  const aKeys = Object.keys(mParameters.action);
  const aActions = aKeys.map((key) => mParameters.action[key]);
  return aActions.includes(sAction);
};

Validator.prototype.isFileExists = function (sFileName) {
  if (!sFileName) {
    return Promise.resolve();
  }

  return new Promise((res, rej) => {
    fs.open(sFileName, (err) => {
      if (err) {
        process.stderr.write(`The file ${sFileName} doesn't exist \n`);
        rej();
      } else {
        res();
      }
    });
  });
};

Validator.prototype.isMandatoryParamsFilled = function (options) {
  if (!options.shift || !options.action) {
    process.stderr.write('The \'shift\' and \'action\' are mandatory parameters. Please check that you\'ve specified them correctly. \n');
    return Promise.reject();
  }
  return Promise.resolve();
};

module.exports = Validator;
