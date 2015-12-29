# Transactions

Transactions API is available for adapters that support it (currently SQL-based environments).

The API is fully Promise-based.

## Basic Example

To run queries in a transaction, first start a new transaction from Database instance:

```js
var f = require('firenze');
var Promise = f.Promise;

// import your Database instance
var db = require('../config/db');

// begin a new transaction
db.transaction(function (t) {
  // `t` is a reference to our Transaction object here

  return Promise.all([
    // queries here...
  ]);
}).then(function () {
  // transaction successfully committed
}).catch(function () {
  // one of the operations failed, so rolled back
});
```

Read more on bluebird's [Promise.all](http://bluebirdjs.com/docs/api/promise.all.html) for understanding how multiple promises are resolved.

## Query

To directly use queries in a transaction:

```js
db.transaction(function (t) {
  return Promise.all([
    // first query
    db.query()
      .table('posts')
      .create({title: 'Hello World'})
      .transact(t) // let Query know it is in a transaction
      .run(),

    // second query
    db.query()
      .table('authors')
      .where({id: 1})
      .delete()
      .transact(t) // let Query know it is in a transaction
      .run()
  ]);
}).then(function () {
  // success, if both queries were successful.
}).catch(function () {
  // errored, if any of the two queries failed.
  // meaning the database has rolled back without making any changes at all
});
```

## Model

Working with Models for transactions is similar too:

```js
var Posts = require('../collections/Posts');

var posts = new Posts();

db.transaction(function (t) {
  return Promise.all([
    // create a new Post
    posts.model({title: 'Hello World'})
      .transact(t) // let Model know it is in a transaction
      .save(),

    // delete a Post
    posts.model({id: 1})
      .transact(t) // let Model know it is in a transaction
      .delete()
  ]);
}).then(function () {
  // success
}).catch(function () {
  // error occurred, database rolled back to original state
});
```
