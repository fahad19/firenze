/* eslint-disable new-cap */

import _ from 'lodash';
import P from '../../Promise';

import Adapter from '../../Adapter';

export default class Memory extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;

    this.data = {};
  }

  createTable(model) {
    let table = model.collection().table;
    this.data[table] = [];
    return new P.resolve(true);
  }

  populateTable(model, rows) {
    let table = model.collection().table;
    this.data[table] = rows;
    return new P.resolve(true);
  }

  query(collection, options = {}) {
    let table = collection.table;
    options.collection = collection;

    // fake promise for `list`
    options.then = (func) => {
      return func(this.data[table]);
    };
    options.catch = (func) => {
      return func(false);
    };

    return options;
  }

  create(q, obj) {
    let table = q.collection.table;
    let primaryKey = q.collection.model().primaryKey;
    let ids = _.map(this.data[table], (row) => {
      if (_.isUndefined(row)) {
        return null;
      }
      return row[primaryKey];
    });

    let highestId = _.max(ids);
    let newId = highestId + 1;
    this.data[table].push(_.merge({
      [primaryKey]: newId
    }, obj));
    return new P.resolve([newId]);
  }

  read(q) {
    let table = q.collection.table;
    let primaryKey = q.collection.model().primaryKey;
    let alias = q.collection.model().alias;

    if (!_.isUndefined(q.count)) {
      return new P.resolve([
        {
          '*': this.data[table].length
        }
      ]);
    }

    if (!_.isUndefined(q.conditions) &&
      (!_.isUndefined(q.conditions[primaryKey]) || !_.isUndefined(q.conditions[alias + '.' + primaryKey]))) {
      let record = _.find(this.data[table], (row) => {
        if (_.isUndefined(row)) {
          return null;
        }

        return row[primaryKey] === q.conditions[primaryKey] || row[primaryKey] === q.conditions[alias + '.' + primaryKey];
      });

      return new P.resolve([record]);
    }

    return new P.resolve(this.data[table]);
  }

  update(q, obj) {
    let table = q.collection.table;
    let primaryKey = q.collection.model().primaryKey;

    let record = _.find(this.data[table], (row) => {
      return row[primaryKey] === q.conditions[primaryKey];
    });

    let index = _.findIndex(this.data[table], (row) => {
      return row[primaryKey] === q.conditions[primaryKey];
    });

    this.data[table][index] = _.merge(record, obj);
    return new P.resolve(this.data[table][index]);
  }

  delete(q) {
    let table = q.collection.table;
    let primaryKey = q.collection.model().primaryKey;

    let index = _.findIndex(this.data[table], (row) => {
      return row[primaryKey] === q.conditions[primaryKey];
    });

    delete this.data[table][index];
    return new P.resolve(1);
  }
}
