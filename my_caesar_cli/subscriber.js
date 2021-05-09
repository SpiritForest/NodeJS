module.exports = function subscribeOnErrors(readableStream, writeableStream, transformStream) {
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
};
