import knex from 'knex';
import _ from 'lodash';
import P from 'bluebird';
import async from 'async';

import Adapter from '../Adapter';

export default class Mysql extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;

    let config = {
      client: 'mysql',
      connection: _.pick(this.options, [
        'host',
        'user',
        'password',
        'database',
        'prefix'
      ])
    };

    if (this.options.pool) {
      config.pool = this.options.pool;
    }

    this.knex = knex(config);
  }

  getConnection() {
    return this.knex;
  }

  closeConnection(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    return this.getConnection().destroy(cb);
  }

  create(q, obj) {
    return q.insert(obj);
  }

  read(q) {
    return q;
  }

  update(q, obj) {
    return q.update(obj);
  }

  delete(q) {
    return q.del();
  }

  loadFixture(model, rows) {
    return new P(function (resolve, reject) {
      let connection = model.collection().getDatabase().getConnection();
      let table = model.collection().table;

      async.series([
        function (callback) {
          connection.schema.dropTableIfExists(table)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        function (callback) {
          connection.schema.createTable(table, function (t) {
            _.each(model.schema, function (column, name) {
              t[column.type](name);
            });
          })
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        function (callback) {
          connection(table).insert(rows)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        }
      ], function (err, results) {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      });
    });
  }

  loadAllFixtures(arr) {
    return new P((resolve, reject) => {
      async.map(arr, (fixture, callback) => {
        this.loadFixture(fixture.model, fixture.data).then(function (results) {
          callback(null, results);
        }).catch(function (error) {
          callback(error);
        });
      }, function (err, results) {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      });
    });
  }

  query(collection, options = {}) {
    let exp = collection.table;
    let alias = collection.model().alias;
    if ((_.isUndefined(options.alias) || options.alias) && alias) {
      exp += ' as ' + alias;
    }
    let query = collection.getDatabase().getConnection()(exp);
    query = this.queryOptions(query, options);
    return query;
  }

  queryOptions(query, options) {
    let apply = [
      'Conditions',
      'Fields',
      'Count',
      'Order',
      'Group',
      'Limit'
    ];

    apply.forEach((a) => {
      this['query' + a](query, options);
    });

    return query;
  }

  queryConditions(query, options = {}) {
    let conditions = _.isObject(options.conditions) ? options.conditions : null;
    let self = this;
    _.each(conditions, function (v, k) {
      k = _.trim(k);

      if (k === 'AND') {
        query.where(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'OR') {
        query.orWhere(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'NOT') {
        query.whereNot(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (_.includes(k, ' ')) {
        let parts = k.split(' ');
        let field = parts[0];
        let operator = parts[1];

        if (_.isNull(v) && _.includes(['!=', '<>'], operator)) {
          query.whereNotNull(field);
        } else if (_.isArray(v) && _.includes(['!='], operator)) {
          query.whereNotIn(field, v);
        } else {
          query.where(field, operator, v);
        }
      } else {
        if (_.isNull(v)) {
          query.whereNull(k);
        } else if (_.isArray(v)) {
          query.whereIn(k, v);
        } else {
          query.where(k, v);
        }
      }
    });

    return query;
  }

  queryOrder(query, options = {}) {
    let order = _.isObject(options.order) ? options.order : {};
    _.each(order, function (v, k) {
      query.orderBy(k, v);
    });
    return query;
  }

  queryGroup(query, options = {}) {
    let group = _.isObject(options.group) ? options.group : [];
    _.each(group, function (v, k) {
      query.groupBy(k, v);
    });
    return query;
  }

  queryFields(query, options = {}) {
    let fields = _.isArray(options.fields) ? options.fields : [];
    if (fields.length === 0) {
      return query;
    }

    _.each(fields, function (v) {
      query.select(v);
    });
    return query;
  }

  queryLimit(query, options = {}) {
    if (options.limit && options.page) {
      let limit = parseInt(options.limit, 10);
      let page = parseInt(options.page, 10);

      query
        .limit(limit)
        .offset((page - 1) * limit);
    } else if (options.limit) {
      query.limit(parseInt(options.limit, 10));
    }

    return query;
  }

  queryCount(query, options = {}) {
    if (options.count) {
      query.count();
    }

    return query;
  }
}
