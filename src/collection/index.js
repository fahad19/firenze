var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function (_options = {}) {
  class Collection {
    constructor(extend = {}) {
      this.modelClass = null;
      this.table = null;
      this.alias = null;
      this.finders = {
        all: 'findAll',
        first: 'findFirst',
        count: 'findCount'
      };
      _.merge(this, _options, extend);
    }

    model(options = {}) {
      if (!this.modelClass) {
        return new Error('Cannot find any modelClass');
      }

      var isInstance = function (i) {
        return !_.isFunction(i) && _.isObject(i.schema);
      };

      var M = new this.modelClass(options);
      if (isInstance(M)) {
        return M;
      }

      M = new M(options);
      if (isInstance(M)) {
        return M;
      }

      return new M(options);
    }

    database() {
      return this.db;
    }

    setDatabase(db) {
      this.db = db;
    }

    getQuery(options = {}) {
      var exp = this.table;
      var alias = this.model().alias;
      if (alias) {
        exp += ' as ' + alias;
      }
      var query = this.database().connection()(exp);
      query = this.applyOptions(query, options);
      return query;
    }

    applyOptions(query, options) {
      query = this.applyConditions(query, options);
      query = this.applyOrder(query, options);
      return query;
    }

    applyConditions(query, options = {}) {
      var conditions = _.isObject(options.conditions) ? options.conditions : null;
      _.each(conditions, function (v, k) {
        query.where(k, v);
      });

      return query;
    }

    applyOrder(query, options = {}) {
      var order = _.isObject(options.order) ? options.order : {};
      _.each(order, function (v, k) {
        query.orderBy(k, v);
      });
      return query;
    }

    find(type = 'first', options = {}) {
      if (!this.finders[type] || !_.isFunction(this[this.finders[type]])) {
        throw new Error('Invalid find type');
      }

      return this[this.finders[type]](options);
    }

    findAll(options = {}) {
      var query = this.getQuery(options);

      var self = this;
      return new Promise(function (resolve, reject) {
        return query.then(function (results) {
          var models = [];
          _.each(results, function (v, k) {
            models.push(self.model({
              attributes: v
            }));
          });
          return resolve(models);
        }).catch(reject);
      });
    }

    findFirst(options = {}) {
      var query = this.getQuery(options);
      query.limit(1);

      var self = this;
      return new Promise(function (resolve, reject) {
        return query.then(function (results) {
          if (results.length === 0) {
            return resolve(null);
          }

          return resolve(self.model({
            attributes: results[0]
          }));
        }).catch(reject);
      });
    }

    findCount(options = {}) {
      var query = this.getQuery(options);
      query.count();

      var self = this;
      return new Promise(function (resolve, reject) {
        return query.then(function (results) {
          if (results.length === 0) {
            return resolve(null);
          }

          var firstKey = _.first(_.keys(results[0]));
          var count = results[0][firstKey];

          return resolve(count);
        }).catch(reject);
      });
    }
  }

  return Collection;
}
