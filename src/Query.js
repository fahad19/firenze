import _ from 'lodash';

import Promise from './Promise';
import Expression from './Expression';
import Functions from './Functions';

// # Query
//
// The query builder is the heart of all Adapters.
//
// This class is responsible for building the query and executing it against the database.
//
// ## Usage
//
// For helping understanding better, we will be showing examples with SQL environments below.
//
// ```js
// // create a new Query object
// var query = db.query()
//   .select('id', 'title') // select the columns `id` and `title`
//   .from('posts', 'Post') // from `posts` table, as `Post`
//   .where({ // conditions
//     id: 1
//   })
//   .orderBy({
//     id: 'asc' // order by the column `id` in ascending order
//   })
//   .limit(10); // limit the results set to `10`
//
// // execute it
// query.run()
//   .then(function (results) {
//     console.log(results);
//   });
// ```
//
// Majority of the methods are chainable.
//
export default class Query {

// ## Creating classes
//
// Unless you are building an Adapter yourself, you wouldn't be required to create Query classes yourself.
//
// Example in ES6:
//
// ```js
// // base Query class
// import {Query} from 'firenze';
//
// // custom helper classes needed for creating new Query class
// import FooExpression from './Expression';
// import FooFunctions from './Functions';
//
// export default FooQuery extends Query {
//   constructor(options = {}) {
//     options = {
//       expressionClass: FooExpression,
//       functionsClass: FooFunctions,
//       ...options
//     };
//
//     super(options);
//   }
// }
// ```
//
  constructor(givenOptions = {}) {
    const options = {
      expressionClass: Expression,
      functionsClass: Functions,
      ...givenOptions
    };

// ## Properties
//
// ### adapter
//
// Current instance of Adapter
//
    this.adapter = null;

// ### collection
//
// Current collection (if any)
//
    this.collection = null;

    if (options.adapter) {
      this.setAdapter(options.adapter);
    }

    if (options.collection) {
      this.setCollection(options.collection);
    }

    this.options = _.omit(options, 'adapter', 'collection');
  }

// ## Methods
//
// ### setAdapter(adapter)
//
// Sets adapter to given one
//
  setAdapter(adapter) {
    this.adapter = adapter;

    return this;
  }

// ### getAdapter()
//
// Returns currently set Adapter instance
//
  getAdapter() {
    return this.adapter;
  }

// ### setCollection(collection)
//
// Sets collection to given one
//
  setCollection(collection) {
    this.collection = collection;

    return this;
  }

  select() { return this; }

  distinct() { return this; }

  from() { return this; }

  where() { return this; }

  andWhere() { return this; }

  orWhere() { return this; }

  notWhere() { return this; }

  groupBy() { return this; }

  orderBy() { return this; }

  offset() { return this; }

  limit() { return this; }

  page() { return this; }

  create() { return this; }

  update() { return this; }

  delete() { return this; }

  table() { return this; }

// ### expr()
//
// Read more in Expression section.
//
// Returns a new Expression object
//
  expr(...args) {
    return new this.options.expressionClass(this, ...args);
  }

// ### func()
//
// Read more in Functions section.
//
// Returns a new Functions object
//
  func(...args) {
    return new this.options.functionsClass(this, ...args);
  }

  count() { return this; }

  join() { return this; }

  innerJoin() { return this; }

  leftJoin() { return this; }

  leftOuterJoin() { return this; }

  rightJoin() { return this; }

  rightOuterJoin() { return this; }

  outerJoin() { return this; }

  fullOuterJoin() { return this; }

  crossJoin() { return this; }

// ### all()
//
// Returns a promise, resolving with an array of results after execution
//
  all() { return new Promise.resolve(true); }

// ### first()
//
// Returns a promise, resolving with with a single object result after execution
//
  first() { return new Promise.resolve(true); }

// ### run()
//
// Returns a promise, with the direct result of execution
//
  run() { return new Promise.resolve(true); }

// ### toModels(results)
//
// Converts results to model(s), if query is for a Collection
//
  toModels(results) {
    if (!results || !this.collection) {
      return results;
    }

    if (_.isArray(results)) {
      const models = [];
      results.forEach((model) => {
        models.push(this.collection.model(model));
      });

      return models;
    }

    if (_.isObject(results)) {
      return this.collection.model(results);
    }

    return results;
  }

// ### toModel(result)
//
// Alias to `.toModels()`
//
  toModel(...args) {
    return this.toModels(...args);
  }

  debug() { return this; }

// ### tap(fn)
//
// Taps into the query builder chain, so you can perform something in between.
//
// Example:
//
// ```js
// db.query()
//   .select('id', 'title')
//   .tap(function () {
//     // `this` is the Query object here
//   })
//   .run()
// ```
//
  tap(func) {
    func.bind(this)();

    return this;
  }
}
