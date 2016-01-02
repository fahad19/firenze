# Collections

Collections represent a single table in our Database.

## Naming Convention

Let's assume, we have a table called `posts`, and we want to have a Collection for that. We may choose to follow a convention that our Collection names will always be the CamelCased version of the table's name.

For example, a list of table names with their possible Collection name:

* `posts` → `Posts`
* `questions` → `Questions`
* `office_supplies` → `OfficeSupplies`
* `superhero_names` → `SuperheroNames`

## Defining a Collection

Given we want to create a new Collection called `Posts` for the table `posts`, we would create a new file in `./collections/Posts.js`:

```js
// ./collections/Posts.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'posts'
});
```

And that's it really. That's the minimum configuration you need to create a Collection.

But let's go a bit ahead, and look at other options too.

## Alias

Aliases are useful when queries are involved with multiple tables. We can have convention to always have the alias of a Collection by its name in singular form.

For example, a list of Collection names with their possible aliases:

* `Posts` → `Post`
* `OfficeSupplies` → `OfficeSupply`
* `Questions` → `Question`

So we can go ahead with the alias as `Post` here:

```js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'posts',

  alias: 'Post'
});
```

## Schema

firenze.js is capable of creating tables in your database by reading the schema defined in Collection level. This can be read further in the [Migration](../migration) section.

But to define it:

```js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'posts',

  alias: 'Post',

  schema: {
    id: {
      type: 'increments',
      primary: true
    },
    title: {
      type: 'string',
      length: 100
    }
  }
});
```

## Validations

Validation rules can be set per field when defining the schema in a Collection:

```js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'posts',

  alias: 'Post',

  schema: {
    id: {
      type: 'increments',
      primary: true
    },
    title: {
      type: 'string',
      length: 100,
      validate: [
        {
          rule: 'isAlphanumeric',
          message: 'Title must be alphanumeric.'
        }
      ]
    }
  }
});
```

Read more about it in [Validation](../collection/Validation.html) section.
