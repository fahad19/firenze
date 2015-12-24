/* eslint-disable no-console, no-unused-expressions */
var chalk = require('chalk');
var firenze = require('../');

var yargs = require('yargs')
  .command('migration', 'Show commands availble for migrations')
  .example('$0 migration')
  .demand(1, 'Must provide a valid command');

var argv = yargs.argv;
var command = argv._[0];

if (command === 'migration') {
  yargs.reset()
    .usage('$0 migration')
    .command('list', 'List migrations')
    .command('current', 'Show current migration version')
    .command('run [name]', 'Run specific migration by name')
    .command('rollback [name]', 'Roll back specific migration by name')
    .describe('db', 'Path to database file')
    .describe('db-name', 'Name of database instance (if path exports multiple named instances)')
    .describe('directory', 'Directory containing migration files')
    .describe('table', 'Table for migrations (defaults to `migrations`)')
    .demand(2, 'Must provide a valid command')
    .demand('db')
    .argv;

  var subCommand = argv._[1];

  var dbPath = ['.', '/'].indexOf(argv.db.substr(0, 1)) > -1
    ? argv.db
    : ('./' + argv.db);
  if (dbPath.substr(0, 1) === '.') { dbPath = process.cwd() + '/' + dbPath; }

  var db = require(dbPath);
  if (argv['db-name']) { db = db[argv['db-name']]; }

  var migrationOptions = db.options.migrations ? db.options.migrations : {};
  migrationOptions.db = db;

  if (argv.directory) { migrationOptions.directory = argv.directory; }
  if (argv.table) { migrationOptions.table = argv.table; }

  var migration = new firenze.Migration(migrationOptions);

  if (subCommand === 'list') {
    migration.list()
      .then(function (list) {
        if (list.length === 0) {
          return console.log('No migrations availble.');
        }

        console.log('Migrations list:');
        console.log('');

        list.forEach(function (item) {
          var line = '    ' + item.id;
          if (item.run === false) {
            line += ' ' + chalk.bgGreen.bold('[new]');
          }

          console.log(line);
        });
      })
      .catch(function (error) {
        console.log('Error: ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else {
    yargs.showHelp();
  }
} else {
  yargs.showHelp();
}
