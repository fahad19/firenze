/* eslint-disable no-invalid-this */
import _ from 'lodash';

import P from '../../Promise';
import Query from '../../Query';

import SqlExpression from './Expression';
import SqlFunctions from './Functions';

function makeWhere(query, method, ...args) {
  if (typeof args[0] !== 'function') {
    query.builder[method](...args);

    return query;
  }

  query.builder[method](function () {
    const expr = query.expr(this);

    args[0].apply(query, [expr]);
  });

  return query;
}

export default function makeQuery(knex) {
  class SqlQuery extends Query {
    constructor(givenOptions = {}) {
      const options = {
        expressionClass: SqlExpression,
        functionsClass: SqlFunctions,
        ...givenOptions
      };

      super(options);

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

    where(...args) {
      return makeWhere(this, 'where', ...args);
    }

    andWhere(...args) {
      return makeWhere(this, 'andWhere', ...args);
    }

    orWhere(...args) {
      return makeWhere(this, 'orWhere', ...args);
    }

    notWhere(...args) {
      return makeWhere(this, 'whereNot', ...args);
    }

    select(...args) {
      if (args.length === 0) {
        return this;
      }

      args.forEach((arg) => {
        this._select(arg);
      });

      return this;
    }

    _select(field) {
      if (typeof field === 'string') {
        this.builder.select(field);
      } else if (_.isArray(field)) {
        field.forEach((f) => {
          this.builder.select(f);
        });
      } else if (typeof field === 'object') {
        _.each(field, (f, as) => {
          if (typeof f !== 'object' && typeof f !== 'function') {
            this.builder.select(`${f} as ${as}`);

            return;
          }

          let funcString;

          if (typeof f === 'object' && f instanceof SqlFunctions) {
            funcString = f.toString();
          } else if (typeof f === 'function') {
            const func = this.func.bind(this);
            funcString = f.bind(this)(func).toString();
          }

          const raw = knex.raw(`${funcString} as ${as}`);
          this.builder.select(raw);
        });
      }

      return this;
    }

    distinct(givenFields = []) {
      const fields = _.isString(givenFields) ? [givenFields] : givenFields;

      if (fields.length === 0) {
        return this;
      }

      this.builder.distinct(fields);

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

    groupBy(givenColumns) {
      const columns = _.isString(givenColumns) ? [givenColumns] : givenColumns;

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

    debug() {
      console.log('query:', this.builder.toString()); // eslint-disable-line

      return this;
    }
  }

  return SqlQuery;
}
