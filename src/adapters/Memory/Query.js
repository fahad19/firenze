import _ from 'lodash';
import P from 'bluebird';

import Query from '../../Query';

export default class MemoryQuery extends Query {
  constructor(...args) {
    super(...args);

    this.data = this.adapter.getConnection();

    this.builder = _(this.data);
  }

  from(table, alias) {
    this._from = table;

    return this;
  }

  select(fields = []) {
    if (fields.length === 0) {
      return this;
    }

    return this;
  }

  where(conditions) {
    this._where = conditions;

    return this;
  }

  andWhere() { return this; }

  orWhere() { return this; }

  groupBy() { return this; }

  orderBy() { return this; }

  offset() { return this; }

  limit() { return this; }

  create(row) {
    this._create = _.isArray(row) ? row : [row];

    return this;
  }

  update() { return this; }

  delete() {
    this._delete = true;

    return this;
  }

  table(table) {
    this._table = table;

    return this;
  }

  expr() { return this; }

  count() {
    this._count = true;

    return this;
  }

  all() {
    this._all = true;

    return this.run();
  }

  first() {
    this._first = true;

    return this.run();
  }

  run() {
    let value;

    if (!this._create && !this._update && !this._delete) {
      value = this._runRead();
    } else if (this._create) {
      value = this._runCreate();
    } else if (this._update) {
      value = this._runUpdate();
    } else if (this._delete) {
      value = this._runDelete();
    }

    return new P.resolve(value);
  }

  _runDelete() {
    const table = this._table;
    const ids = [];

    let tableRows = this.adapter.getData(table);
    if (typeof tableRows === 'undefined') {
      tableRows = [];
    }

    const k = _.findIndex(tableRows, this._where);
    const removed = tableRows.splice(k, 1);

    this.adapter.setData(table, tableRows);

    return removed.length;
  }

  _runUpdate() {
    const table = this._table;
    const ids = [];

    let tableRows = this.adapter.getData(table);
    if (typeof tableRows === 'undefined') {
      tableRows = [];
    }

    const k = _.findIndex(tableRows, this._where);
    const row = {
      ...tableRows[k],
      ...this._update
    };
    ids.push(row.id); // @TODO: use collection.primaryKey

    this.adapter.setData(`${table}.${k}`, row);

    return ids;
  }

  _runCreate() {
    const ids = [];
    const table = this._table;

    this._create.forEach((row) => {
      let tableRows = this.adapter.getData(table);
      if (typeof tableRows === 'undefined') {
        tableRows = [];
      }

      if (!row.id) {
        row.id = _.uniqueId(); // @TODO: improve this
      }

      tableRows.push({
        ...row
      });

      this.adapter.setData(table, tableRows);
      ids.push(row.id); // @TODO: use collection.primaryKey
    });

    return ids; // IDs
  }

  _runRead() {
    const results = this.builder
      .thru((data) => {
        // from
        if (!this._from) {
          return data;
        }

        if (typeof data[this._from] !== 'undefined') {
          return data[this._from];
        }

        return [];
      })
      .thru((data) => {
        // conditions
        if (!this._where) {
          return data;
        }

        return _.filter(data, _.matches(this._where));
      })
      .thru((data) => {
        // all or first
        if (this._all) {
          return data;
        }

        if (typeof data[0] !== 'undefined') {
          return data[0];
        }

        return null;
      })
      .value();

    if (this._count) {
      return results.length;
    }

    return this.toModels(results);
  }
}
