import _ from 'lodash';

import P from '../../Promise';
import Query from '../../Query';

import SqlExpression from './Expression';
import SqlFunctions from './Functions';

export default function makeQuery(knex) {
  class SqlQuery extends Query {
    constructor(options = {}) {
      options = {
        expressionClass: SqlExpression,
        functionsClass: SqlFunctions,
        ...options
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

    _where(method, ...args) {
      if (typeof args[0] !== 'function') {
        this.builder[method](...args);

        return this;
      }

      const self = this;
      this.builder[method](function () {
        const expr = self.expr(this);

        args[0].apply(self, [expr]);
      });

      return this;
    }

    where(...args) {
      return this._where('where', ...args);
    }

    andWhere(...args) {
      return this._where('andWhere', ...args);
    }

    orWhere(...args) {
      return this._where('orWhere', ...args);
    }

    notWhere(...args) {
      return this._where('whereNot', ...args);
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

    distinct(fields = []) {
      if (_.isString(fields)) {
        fields = [fields];
      }

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

    debug() {
      console.log('query:', this.builder.toString());

      return this;
    }
  }

  return SqlQuery;
}
