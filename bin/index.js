/* eslint-disable no-console, no-unused-expressions */
var yargs = require('yargs')
  .command('migration', 'Show commands available for migrations')
  .example('$0 migration')
  .demand(1, 'Must provide a valid command');

var argv = yargs.argv;
var command = argv._[0];

var commandModule = require('./' + command);

if (typeof commandModule === 'function') {
  commandModule(yargs);
} else {
  yargs.showHelp();
}
