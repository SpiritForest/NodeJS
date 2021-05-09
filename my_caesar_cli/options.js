const {
  Command,
} = require('commander');

module.exports = function getOptions() {
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