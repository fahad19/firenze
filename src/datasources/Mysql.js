var knex = require('knex');
var _ = require('lodash');
var Promise = require('bluebird');

var Datasource = require('../Datasource');

class Mysql extends Datasource {
  constructor(options) {
    this.options = options;

    var config = {
      client: this.options.type,
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

  getQuery(collection, options = {}) {
    var exp = collection.table;
    var alias = collection.model().alias;
    if ((_.isUndefined(options.alias) || options.alias) && alias) {
      exp += ' as ' + alias;
    }
    var query = collection.database().connection()(exp);
    query = this._queryOptions(query, options);
    return query;
  }

  _queryOptions(query, options) {
    query = this._queryConditions(query, options);
    query = this._queryFields(query, options);
    query = this._queryOrder(query, options);
    query = this._queryLimit(query, options);
    query = this._queryGroup(query, options);
    query = this._queryCount(query, options);
    return query;
  }

  _queryConditions(query, options = {}) {
    var conditions = _.isObject(options.conditions) ? options.conditions : null;
    var self = this;
    _.each(conditions, function (v, k) {
      k = _.trim(k);

      if (k === 'AND') {
        query.where(function () {
          self._queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'OR') {
        query.orWhere(function () {
          self._queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'NOT') {
        query.whereNot(function () {
          self._queryConditions(this, {
            conditions: v
          });
        });
      } else if (_.includes(k, ' ')) {
        var parts = k.split(' ');
        var field = parts[0];
        var operator = parts[1];

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

  _queryOrder(query, options = {}) {
    var order = _.isObject(options.order) ? options.order : {};
    _.each(order, function (v, k) {
      query.orderBy(k, v);
    });
    return query;
  }

  _queryGroup(query, options = {}) {
    var group = _.isObject(options.group) ? options.group : [];
    _.each(group, function (v, k) {
      query.groupBy(k, v);
    });
    return query;
  }

  _queryFields(query, options = {}) {
    var fields = _.isArray(options.fields) ? options.fields : [];
    if (fields.length === 0) {
      return query;
    }

    _.each(fields, function (v) {
      query.select(v);
    });
    return query;
  }

  _queryLimit(query, options = {}) {
    if (options.limit && options.page) {
      var limit = parseInt(options.limit, 10);
      var page = parseInt(options.page, 10);

      query
        .limit(limit)
        .offset((page - 1) * limit);
    } else if (options.limit) {
      query.limit(parseInt(options.limit, 10));
    }

    return query;
  }

  _queryCount(query, options = {}) {
    if (options.count) {
      query.count();
    }

    return query;
  }
}
