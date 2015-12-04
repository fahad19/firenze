import _ from 'lodash';

import Promise from './Promise';
import Expression from './Expression';
import Functions from './Functions';

// # Query
//
// The query builder.
//
// ## Example usage
//
// ```js
// db.query()
//   .select('id', 'title')
//   .from('posts', 'Post')
//   .where({
//     id: 1
//   })
//   .offset(0)
//   .limit(10)
//   .run()
//   .then(function (results) {
//
//   });
// ```
//
export default class Query {
  constructor(givenOptions = {}) {
    const options = {
      expressionClass: Expression,
      functionsClass: Functions,
      ...givenOptions
    };

    this.adapter = null;
    this.collection = null;

    if (options.adapter) {
      this.setAdapter(options.adapter);
    }

    if (options.collection) {
      this.setCollection(options.collection);
    }

    this.options = _.omit(options, 'adapter', 'collection');
  }

  setAdapter(adapter) {
    this.adapter = adapter;

    return this;
  }

  getAdapter() {
    return this.adapter;
  }

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

  create() { return this; }

  update() { return this; }

  delete() { return this; }

  table() { return this; }

  expr(...args) {
    return new this.options.expressionClass(this, ...args);
  }

  func(...args) {
    return new this.options.functionsClass(this, ...args);
  }

  count() { return this; }

  all() { return new Promise.resolve(true); }

  first() { return new Promise.resolve(true); }

  run() { return new Promise.resolve(true); }

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

  toModel(...args) {
    return this.toModels(...args);
  }

  debug() { return this; }

  tap(func) {
    func.bind(this)();

    return this;
  }
}
