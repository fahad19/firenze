/* eslint-disable no-console, no-unused-expressions */
var chalk = require('chalk');
var firenze = require('../');

module.exports = function (yargs) {
  var argv = yargs.argv;

  yargs.reset()
    .usage('$0 migration')
    .command('list', 'List migrations')
    .command('current', 'Show current migration version')
    .command('generate', 'Generate a new migration file')
    .command('run [name]', 'Run specific migration by name')
    .command('runAll', 'Run all pending migrations')
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

  if (argv.directory) { migrationOptions.directory = process.cwd() + '/' + argv.directory; }
  if (argv.table) { migrationOptions.table = argv.table; }

  var migration = new firenze.Migration(migrationOptions);
  var name;

  if (subCommand === 'list') {
    migration.list()
      .then(function (list) {
        if (list.length === 0) {
          return console.log('No migrations available.');
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
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else if (subCommand === 'current') {
    migration.current()
      .then(function (record) {
        if (!record) {
          return console.log('No migrations have been run yet.');
        }

        console.log('Last ran migration is ' + chalk.bold(record.id) + ' on ' + chalk.underline(record.created));
      })
      .catch(function (error) {
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else if (subCommand === 'generate') {
    if (typeof argv._[2] === 'undefined') {
      console.log(chalk.bgRed('Error:') + ' No name given');
      db.close();

      return;
    }

    name = argv._[2];
    migration.generate(name)
      .then(function (result) {
        console.log('Generated migration file at: ' + chalk.bold(result));
      })
      .catch(function (error) {
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else if (subCommand === 'run') {
    if (typeof argv._[2] === 'undefined') {
      console.log(chalk.bgRed('Error:') + ' No name given');
      db.close();

      return;
    }

    name = argv._[2];
    migration.run(name)
      .then(function () {
        console.log('Successfully ran ' + chalk.bold(name));
      })
      .catch(function (error) {
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else if (subCommand === 'runAll') {
    migration.runAll()
      .then(function () {
        console.log('Successfully ran all migrations.');
      })
      .catch(function (error) {
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else if (subCommand === 'rollback') {
    if (typeof argv._[2] === 'undefined') {
      console.log(chalk.bgRed('Error:') + ' No name given');
      db.close();

      return;
    }

    name = argv._[2];
    migration.run(name, 'down')
      .then(function () {
        console.log('Successfully rolled back ' + chalk.bold(name));
      })
      .catch(function (error) {
        console.log(chalk.bgRed('Error:') + ' ' + error);
      })
      .finally(function () {
        db.close();
      });
  } else {
    yargs.showHelp();
    db.close();
  }
};
