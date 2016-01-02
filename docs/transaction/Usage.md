# Transaction Usage

## Basic Example

To run queries in a transaction, first start a new transaction from Database instance:

```js
// import your Database instance
var db = require('../config/db');

// begin a new transaction
db.transaction(function (t) {
  // must return a Promise
  return db.query()
    // ...
    .transact(t) // `t` is our Transaction object here
    .run()
    .then(t.commit) // commit everything
    .catch(t.rollback); // something went wrong, roll database back to original state
}).then(function () {
  // transaction successfully committed
}).catch(function () {
  // one of the operations failed, so rolled back
});
```

Transaction API can be be used from both [Query](../query) and [Model](../model) objects.

## Query

To directly use queries in a transaction:

```js
db.transaction(function (t) {
  // first query
  return db.query()
    .table('posts')
    .create({title: 'Hello World'})
    .transact(t) // let Query know it is in a transaction
    .run()
    .then(function (postIds) {
      // `postIds[0]` is the ID of Post we just created

      // second query, by chaining the Promise
      db.query()
        .table('authors')
        .where({id: 1})
        .delete()
        .transact(t) // let Query know it is in a transaction
        .run()
    })
    .then(t.commit)
    .catch(t.rollback);
}).then(function () {
  // success, if both queries were successful.
}).catch(function () {
  // errored, if any of the two queries failed.
  // meaning the database has rolled back without making either of the changes
});
```

## Model

Working with Models for transactions is similar too:

```js
var Posts = require('../collections/Posts');

var posts = new Posts();

db.transaction(function (t) {
  // create a new Post
  return posts.model({title: 'Hello World'})
    .transact(t) // let Model know it is in a transaction
    .save()
    .then(function () {
      // delete a Post
      return posts.model({id: 1})
        .transact(t) // let Model know it is in a transaction
        .delete()
    })
    .then(t.commit)
    .catch(t.rollback);
}).then(function () {
  // success
}).catch(function () {
  // error occurred, database rolled back to original state
});
```
