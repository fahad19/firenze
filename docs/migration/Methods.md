# Migrations Methods

### initTable()

Initializes the table in database for Migrations.

Returns a promise.

### list()

Lists migrations.

Returns a promise.

### current()

Shows last ran migration.

Returns a promise.

### run(filename, direction = 'up')

Runs migration for specified filename, for e.g., `YYYYMMDDHHMMSS_someMigration.js`.

Returns a promise.

### runAll()

Runs all pending migrations.

Returns a promise.

### generate()

Generates a new migration file.

Returns a promise, resolving with file path.

