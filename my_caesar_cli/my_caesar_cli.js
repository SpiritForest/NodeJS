const { Command } = require('commander');
const fs = require('fs');
const converter = require('./converter');
const program = new Command();
program.version('0.0.1');

function getOptions () {
  program
  .option('-s, --shift <number>', 'shift')
  .option('-i, --input <string>', 'input')
  .option('-o, --output <string>', 'output')
  .option('-a, --action <type>', 'action');
  
  program.parse(process.argv);
  
  return program.opts();
}

function modifyData() {
  const options = getOptions();
  let readableStream = options.input ? fs.createReadStream(options.input, "utf8") : process.stdin("utf8");
  let writeableStream = options.output ? fs.createWriteStream(options.output) : process.stdout;
  
  readableStream.on("data", (chunk) => {
    console.log(chunk)
    let transformedChunk = transformChunk(chunk);

    writeableStream.write(transformedChunk);
  });
}  


function transformChunk (chunk) {
  const options = getOptions();
  const bEncrypt = options.action === "encode";

  if (options.shift && options.action && ["encode", "decode"].includes(options.action)) {
    return converter(chunk, bEncrypt, options.shift);
  } else {
    process.strerr("The process should exit with non-zero status code");
  }
}

modifyData();