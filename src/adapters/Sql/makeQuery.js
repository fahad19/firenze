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

function extractJoinOptions(table, ...args) {
  let alias = table;
  let on = function () { };

  if (args[1] !== 'undefined') {
    alias = args[0];
    on = args[1];
  } else {
    on = args[0];
  }

  return {
    table,
    alias,
    on
  };
}

function getJoinMethodByType(type) {
  switch (type.toUpperCase()) {
    case 'INNER':
      return 'innerJoin';
    case 'LEFT':
      return 'leftJoin';
    case 'LEFT OUTER':
      return 'leftOuter';
    case 'RIGHT':
      return 'rightJoin';
    case 'RIGHT OUTER':
      return 'rightOuter';
    case 'OUTER':
      return 'outer';
    case 'FULL OUTER':
      return 'fullOuter';
    default:
      return 'leftJoin';
  }
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

// ### select()
//
// Selects columns to be fetched.
//
// Can be called in various ways.
//
// #### Array
//
// ```js
// query.select(['id', 'title']);
// ```
//
// #### Arguments
//
// ```js
// query.select('id', 'title');
// ```
//
// #### Object
//
// ```js
// query.select('id', {
//   someTitle: 'title' //
// }); // `SELECT id, title as someTitle`
// ```
//
// #### Function
//
// ```js
// query.select('id', function (column) {
//   return column('title')
//     .upper()
//     .trim();
// }); // `SELET id, TRIM(UPPER(title))`
// ```
//
// Read more about column Functions in its own section.
//
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

// ### distinct(fields)
//
// Selects DISTINCT columns given as an array
//
    distinct(givenFields = []) {
      const fields = _.isString(givenFields) ? [givenFields] : givenFields;

      if (fields.length === 0) {
        return this;
      }

      this.builder.distinct(fields);

      return this;
    }

// ### from (table, alias = null)
//
// Specify the table where to fetch results from
//
// * `.from('users')` would result in `SELECT * FROM users`
// * `.from('users', 'User')` would result in `SELECT * FROM users AS User`
//
    from(table, alias = null) {
      let exp = table;
      if (alias) {
        exp += ` as ${alias}`;
      }

      this.table(exp);

      return this;
    }

// ### table(table)
//
// Not all query operations are SELECTs, but still require setting a table.
//
// `.table()` can be used in those scenarios.
//
    table(table) {
      this.builder.table(table);

      return this;
    }

// ### where()
//
// Sets conditions to the Query object.
//
// Conditions can be set in various ways. For e.g, the same query for finding results where `id = 1` can be written as follows:
//
// **Plain object**:
//
// ```js
// query.where({
//   id: 1
// });
// ```
//
// **Function**:
//
// ```js
// query.where(function (expr) {
//   // `expr` is an Expression object here
//   expr.eq('id', 1);
// });
// ```
//
// Read more about Expressions in its own section.
//
    where(...args) {
      return makeWhere(this, 'where', ...args);
    }

// ### andWhere()
//
// Same as `.where()` but with `AND` operator
//
    andWhere(...args) {
      return makeWhere(this, 'andWhere', ...args);
    }

// ### orWhere()
//
// Same as `.where()` but with `OR` operator
//
    orWhere(...args) {
      return makeWhere(this, 'orWhere', ...args);
    }

// ### notWhere()
//
// Same as `.where()` but with `NOT` operator
//
    notWhere(...args) {
      return makeWhere(this, 'whereNot', ...args);
    }

// ### limit(number)
//
// Limit query results
//
    limit(limit) {
      this._limit = limit;
      this.builder.limit(limit);

      return this;
    }

// ### page(number)
//
// Call it only if `.limit()` was called before.
//
// Paginates results to certain page.
//
    page(page) {
      if (typeof this._limit === 'undefined') {
        return this;
      }

      const offset = (page - 1) * this._limit;
      this.offset(offset);

      return this;
    }

// ### offset(number)
//
// Offsets results. Do not use it together with `.page()`.
//
    offset(offset) {
      this.builder.offset(offset);

      return this;
    }

// ### orderBy(name, direction)
//
// Accepts options in two ways:
//
// **Arguments**
//
// ```js
// query.orderBy('created', 'asc');
// ```
//
// ***Object**
//
// ```js
// query.orderBy({
//   created: 'asc'
// });
// ```
//
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

// ### groupBy(column)
//
// Groups results set by given column.
//
// Can be a string or an array of columns.
//
    groupBy(givenColumns) {
      const columns = _.isString(givenColumns) ? [givenColumns] : givenColumns;

      this.builder.groupBy(columns);

      return this;
    }

// ### count()
//
// Count the number of results
//
// Example:
//
// ```js
// query
//   .from('users')
//   .where({active: 1})
//   .count()
//   .run()
//   .then(function (count) {
//     // `count` is an integer here
//   });
// ```
//
    count(...args) {
      this.builder.count(...args);
      this._count = true;

      return this;
    }

// ### create(row)
//
// Insert a single or multiple objects into the table
//
    create(row) {
      this.builder.insert(row);

      return this;
    }

// ### update(row)
//
// Update with given row
//
    update(row) {
      this.builder.update(row);

      return this;
    }

// ### delete()
//
// Delete records based on current Query conditions
//
    delete() {
      this.builder.delete();

      return this;
    }

// ### join(options)
//
// Base method for joining tables.
//
// For example, a LEFT join:
//
// ```js
// query
//   .select('*')
//   .from('posts', 'Post')
//   .join({
//     type: 'LEFT',
//     table: 'authors',
//     alias: 'Author',
//     on: function (expr) {
//       expr.eq('Post.author_id', 'Author.id');
//     }
//   })
//   .run()
// ```
//
// There are also other handy methods for various kinds of JOINs
//
    join(givenOptions = {}) {
      const options = {
        type: null,
        table: null,
        alias: null,
        on: function () { },
        ...givenOptions
      };

      const joinMethod = getJoinMethodByType(options.type);
      const tableName = options.alias ? `${options.table} as ${options.alias}` : options.table;
      const query = this;

      this.builder[joinMethod](tableName, function () {
        const expr = query.expr(this, {joins: true});
        options.on.apply(query, [expr]);
      });

      return this;
    }

// ### innerJoin(options)
//
// Wrapper for `INNER` join.
//
    innerJoin(...args) {
      return this.join({
        type: 'INNER',
        ...extractJoinOptions(...args)
      });
    }

// ### leftJoin(options)
//
// Wrapper for `LEFT` join.
//
    leftJoin(...args) {
      return this.join({
        type: 'LEFT',
        ...extractJoinOptions(...args)
      });
    }

// ### leftOuterJoin(options)
//
// Wrapper for `LEFT OUTER` join.
//
    leftOuterJoin(...args) {
      return this.join({
        type: 'LEFT OUTER',
        ...extractJoinOptions(...args)
      });
    }

// ### rightJoin(options)
//
// Wrapper for `RIGHT` join.
//
    rightJoin(...args) {
      return this.join({
        type: 'RIGHT',
        ...extractJoinOptions(...args)
      });
    }

// ### rightOuterJoin(options)
//
// Wrapper for `RIGHT OUTER` join.
//
    rightOuterJoin(...args) {
      return this.join({
        type: 'RIGHT OUTER',
        ...extractJoinOptions(...args)
      });
    }

// ### outerJoin(options)
//
// Wrapper for `OUTER` join.
//
    outerJoin(...args) {
      return this.join({
        type: 'OUTER',
        ...extractJoinOptions(...args)
      });
    }

// ### fullOuterJoin(options)
//
// Wrapper for `FULL OUTER` join.
//
    fullOuterJoin(...args) {
      return this.join({
        type: 'FULL OUTER',
        ...extractJoinOptions(...args)
      });
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

// ### debug()
//
// Prints out the currently developed Query as a string in console
//
    debug() {
      console.log('query:', this.builder.toString()); // eslint-disable-line

      return this;
    }
  }

  return SqlQuery;
}
