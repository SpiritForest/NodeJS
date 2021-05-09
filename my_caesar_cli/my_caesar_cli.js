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
const mParameters = {
  encodingType: 'utf8',
  action: {
    encode: 'encode',
    decode: 'decode',
  },
  chunkType: {
    buffer: 'buffer',
    string: 'string',
  },
};

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

function isActionAllowable(sAction) {
  const aKeys = Object.keys(mParameters.action);
  const aActions = aKeys.map((key) => mParameters.action[key]);
  return aActions.includes(sAction);
}

function transformChunk(chunk) {
  const options = getOptions();
  const bEncrypt = options.action === mParameters.action.encode;

  if (isActionAllowable(options.action)) {
    return converter(chunk, bEncrypt, options.shift);
  }

  return undefined;
}

function isMandatoryParamsFilled(options) {
  if (!options.shift || !options.action) {
    process.stderr.write('The \'shift\' and \'action\' are mandatory parameters. Please check that you\'ve specified them correctly. \n');
    return Promise.reject();
  }
  return Promise.resolve();
}

function isFileExists(sFileName) {
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
}

function subscribeOnErrors(readableStream, writeableStream, transformStream) {
  const onWritableStreamError = (err) => {
    process.stderr.write('Output file doesn\'t exist \n');
  };
  const onTranformStreamError = (err) => {
    process.stderr.write('An error occured while data transformation \n');
  };
  const onReadableStreamError = (err) => {
    process.stderr.write('Input file doesn\'t exist \n');
    writeableStream.off('error', onWritableStreamError);
    transformStream.off('error', onTranformStreamError);
  };

  readableStream.on('error', onReadableStreamError);
  writeableStream.on('error', onWritableStreamError);
  transformStream.on('error', onTranformStreamError);
}

function modifyData() {
  const options = getOptions();

  Promise.all([
    isMandatoryParamsFilled(options),
    isFileExists(options.input),
    isFileExists(options.output),
  ])
    .then(() => {
      const readableStream = options.input
        ? fs.createReadStream(options.input)
        : process.stdin;
      const writeableStream = options.output
        ? fs.createWriteStream(options.output)
        : process.stdout;
      const transformStream = new Transform({
        transform(chunk, encoding, encode) {
          const sChunk = encoding === mParameters.chunkType.buffer
            ? chunk.toString(encodingType)
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

      readableStream.setEncoding(encodingType);

      pipeline(
        readableStream,
        transformStream,
        writeableStream,
        (err) => {
          if (err) {
            process.stderr.write('Pipeline failed. \n');
          } else {
            process.stderr.write('Pipeline succeeded. \n');
          }
        },
      );
    })
    .catch((err) => {
      process.stderr.write('An error occured while data modifying \n');
    });
}

modifyData();