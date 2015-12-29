import _ from 'lodash';

import Promise from './Promise';
import Expression from './Expression';
import Functions from './Functions';

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

  page() { return this; }

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

  truncate() { return this; }

  join() { return this; }

  innerJoin() { return this; }

  leftJoin() { return this; }

  leftOuterJoin() { return this; }

  rightJoin() { return this; }

  rightOuterJoin() { return this; }

  outerJoin() { return this; }

  fullOuterJoin() { return this; }

  crossJoin() { return this; }

  transact() { return this; }

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
