import _ from 'lodash';
import P from 'bluebird';

import Query from '../../Query';

export default class SqlQuery extends Query {
  constructor(...args) {
    super(...args);

    this.builder = this.adapter.getConnection().queryBuilder();

    if (this.collection) {
      this.table(this.collection.table);
    }
  }

  from(table, alias = null) {
    let exp = table;
    if (alias) {
      exp += ` as ${alias}`;
    }

    this.table(exp);

    return this;
  }

  table(table) {
    this.builder.table(table);

    return this;
  }

  where(conditions) {
    this.builder.where(conditions);

    return this;
  }

  select(fields = []) {
    if (fields.length === 0) {
      return this;
    }

    this.builder.select(fields);

    return this;
  }

  limit(limit) {
    this.builder.limit(limit);

    return this;
  }

  offset(offset) {
    this.builder.offset(offset);

    return this;
  }

  orderBy(name, direction = 'asc') {
    if (_.isObject(name)) {
      _.each(name, (v, k) => {
        this.orderBy(k, v);
      });

      return this;
    }

    this.builder.orderBy(name, direction);

    return this;
  }

  groupBy(columns) {
    if (_.isString(columns)) {
      columns = [columns];
    }

    this.builder.groupBy(columns);

    return this;
  }

  count(...args) {
    this.builder.count(...args);
    this._count = true;

    return this;
  }

  create(row) {
    this.builder.insert(row);

    return this;
  }

  update(row) {
    this.builder.update(row);

    return this;
  }

  delete() {
    this.builder.delete();

    return this;
  }

  run() {
    return new P((resolve, reject) => {
      this.builder
        .then((results) => {
          if (this._count) {
            return resolve(_.values(results[0])[0]);
          }

          return resolve(results);
        })
        .catch(reject);
    });
  }

  all() {
    return new P((resolve, reject) => {
      this.run()
        .then((results) => {
          resolve(this.toModels(results));
        })
        .catch(reject);
    });
  }

  first() {
    this.limit(1);

    return new P((resolve, reject) => {
      this.run()
        .then((results) => {
          if (results.length > 0) {
            return resolve(this.toModel(results[0]));
          }

          resolve(null);
        })
        .catch(reject);
    });
  }
}
