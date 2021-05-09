const getOptions = require('./options');
const settings = require('./settings');
const converter = require('./converter');
const Validator = require('./validator');

const validator = new Validator();

module.exports = function transformChunk(chunk) {
  const options = getOptions();
  const bEncrypt = options.action === settings.action.encode;

  if (validator.isActionAllowable(options.action, settings)) {
    return converter(chunk, bEncrypt, options.shift);
  }

  return undefined;
}