# Migration Usage

You can use the Migration feature either via CLI or programmatically via API.

## CLI

When you install `firenze` in your project, you will have access to it via:

```
$ npm install --save firenze

$ ./node_modules/.bin/firenze
```

If you have installed `firenze` globally, then you can have access to it directly:

```
$ npm install -g firenze

$ firenze
```

### Available commands

You can have info about available commands for Migration by running this:

```
$ firenze migration

Commands:
  list             List migrations
  current          Show current migration version
  generate         Generate a new migration file
  run [name]       Run specific migration by name
  runAll           Run all pending migrations
  rollback [name]  Roll back specific migration by name

Options:
  --db         Path to database file                                  [required]
  --db-name    Name of database instance (if path exports multiple named
               instances)
  --directory  Directory containing migration files
  --table      Table for migrations (defaults to `migrations`)
```

### Running a command

Assuming you are exporting your Database instance from a file in `./config/db.js`:

```js
// ./config/db.js

var f = require('firenze');
var MysqlAdapter = require('firenze-mysql-adapter');

module.exports = new f.Database({
  adapter: MysqlAdapter,

  // credentials...

  migrations: {
    table: 'migrations', // table for migrations info
    directory: __dirname + '/migrations', // directory where files will be stored
  }
});
```

### List migrations

You can now run the command specifying the path to the `db.js` file like this:

```
$ firenze migration list --db ./config/db.js

Migrations list:

    20151225180000_firstMigration.js
    20151225183000_secondMigration.js [new]
```

Items ending with `[new]` indicates those migrations have not been run yet.

### Run a migration

```
$ firenze migration run 20151225183000_secondMigration.js --db ./config/db.js
```

### Run all pending migrations

```
$ firenze migration runAll --db ./config/db.js
```

### Generate a new migration file

```
$ firenze migration generate someNameHere --db ./config/db.js
```

### Rolling back

If you feel a migration didn't go right, you can roll it back too:

```
$ firenze migration rollback 20151225183000_secondMigration.js --db ./config/db.js
```

## API

To use Migrations programmatically:

```js
var f = require('firenze');
var Migration = f.Migration;

var db = require('./config/db');

var migration = new Migration({
  db: db,

  // optional
  directory: __dirname + '/migrations',
  table: 'migrations'
});
```

You now have access to methods like `.run()`, `.generate`, etc. More in Methods section.
