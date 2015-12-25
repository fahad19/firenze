# Writing Migration File

You can generate an empty migration file as follows:

```
$ firenze migration generate something --db ./config/db.js

Generated migration file at: ./migrations/YYYYMMDDHHMMSS_something.js
```

This generates an empty file like this:

```js
// ./migrations/YYYYMMDDHHMMSS_something.js
var Promise = require('firenze').Promise;

module.exports = {
  before: function (db, direction) {
    return new Promise.resolve(true);
  },

  up: function (db) {
    return new Promise.resolve(true);
  },

  down: function (db) {
    return new Promise.resolve(true);
  },

  after: function (db, direction) {
    return new Promise.resolve(true);
  }
};
```

All of the functions above are expected to return a Promise.

Let's make use of this boilerplate.

## up

This is where you write your code for the shema changes. Assume, you needed to create a new table `posts`, with the columns `id`, and `title`:

```js
{
  up: function (db) {
    // we can return it directly, since `createTable` returns a Promise already
    return db.schema()
      .createTable('posts', {
        id: {
          type: 'increments', // uuid or integer, etc
          primary: true
        },
        title: {
          type: 'string',
          length: 100,
          nullable: false
        }
      });
  }
}
```

Find more ways to manipulate the database in [Schema](../Schema) section.

## down

This is where you the rollback code goes in.

Imagine you ran the migration for creating the table `posts`, what would you do to reverse it? You drop it. Thats what `down` is here for:

```js
{
  down: function (db) {
    return db.schema()
      .dropTable('posts');
  }
}
```

## before

If you have anything to process before continuing with running the actual migration, do it here.

## after

Like `before`, if you have anything to perform after the migration has finished, this is the place.
