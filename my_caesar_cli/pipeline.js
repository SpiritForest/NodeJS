const {
  Transform,
  pipeline,
  Stream,
} = require('stream');
const fs = require('fs');
const settings = require('./settings');
const transformChunk = require('./transformChunk');
const subscribeOnErrors = require('./subscriber');
const getOptions = require('./options');

module.exports = function () {
  const options = getOptions();

  const readableStream = options.input
    ? fs.createReadStream(options.input)
    : process.stdin;
  const writeableStream = options.output
    ? fs.createWriteStream(options.output, { flags: 'a' })
    : process.stdout;
  const transformStream = new Transform({
    transform(chunk, encoding, encode) {
      const sChunk = encoding === settings.chunkType.buffer
        ? chunk.toString(settings.encodingType)
        : chunk;
      const sTransformedChunk = transformChunk(sChunk);

      encode(null, sTransformedChunk);
    },
  });

  subscribeOnErrors(
    readableStream,
    writeableStream,
    transformStream,
  );

  readableStream.setEncoding(settings.encodingType);

  pipeline(
    readableStream,
    transformStream,
    writeableStream,
    (err) => {
      if (err) {
        process.stderr.write('Pipeline failed. \n');
      } else {
        fs.appendFile(options.output, '\n', options.encodingType, (err) => {});
        process.stderr.write('Pipeline succeeded. \n');
      }
    },
  );
};
