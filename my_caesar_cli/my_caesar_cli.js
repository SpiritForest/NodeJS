const {
  Transform,
} = require('stream');
const {
  pipeline,
} = require('stream');
const {
  Command,
} = require('commander');
const process = require('process');
const fs = require('fs');
const converter = require('./converter');

const encodingType = 'utf8';

function getOptions() {
  const program = new Command();

  program.version('0.0.1');
  program
    .option('-s, --shift <number>', 'shift')
    .option('-i, --input <string>', 'input')
    .option('-o, --output <string>', 'output')
    .option('-a, --action <type>', 'action');

  program.parse(process.argv);

  return program.opts();
}

function transformChunk(chunk) {
  const options = getOptions();
  const bEncrypt = options.action === 'encode';

  if (options.shift && options.action && ['encode', 'decode'].includes(options.action)) {
    return converter(chunk, bEncrypt, options.shift);
  }

  process.stderr.write('The process should exit with non-zero status code');
  return undefined;
}

function modifyData() {
  const options = getOptions();

  const readableStream = options.input ? fs.createReadStream(options.input) : process.stdin;
  const writeableStream = options.output ? fs.createWriteStream(options.output) : process.stdout;
  const transformStream = new Transform({
    transform(chunk, encoding, encode) {
      const sChunk = encoding === 'buffer' ? chunk.toString(encodingType) : chunk;
      const sTransformedChunk = transformChunk(sChunk);

      encode(null, sTransformedChunk);
    },
  });

  readableStream.on('error', (err) => {
    process.stderr.write(`Input file doesn't exist: ${err.message}`);
  });

  writeableStream.on('error', (err) => {
    process.stderr.write(`Output file doesn't exist: ${err.message}`);
  });

  transformStream.on('error', (err) => {
    process.stderr.write(`An error occured while data transformation: ${err.message}`);
  });

  readableStream.setEncoding(encodingType);

  pipeline(
    readableStream,
    transformStream,
    writeableStream,
    (err) => {
      if (err) {
        process.stderr.write('Pipeline failed.', err);
      } else {
        process.stderr.write('Pipeline succeeded.');
      }
    },
  );
}

modifyData();
