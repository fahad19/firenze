var _ = require('lodash');
var Promise = require('bluebird');

var query = require('../common/query');

module.exports = function (_options = {}) {
  class Collection {
    constructor(extend = {}) {
      this.modelClass = null;
      this.table = null;
      this.alias = null;
      this.finders = {
        all: 'findAll',
        first: 'findFirst',
        count: 'findCount',
        list: 'findList'
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
      return query.get(this, options);
    }

    find(type = 'first', options = {}) {
      if (!this.finders[type] || !_.isFunction(this[this.finders[type]])) {
        throw new Error('Invalid find type');
      }

      return this[this.finders[type]](options);
    }

    findAll(options = {}) {
      var q = this.getQuery(options);

      var self = this;
      return new Promise(function (resolve, reject) {
        return q.then(function (results) {
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
      var q = this.getQuery(options);
      q.limit(1);

      var self = this;
      return new Promise(function (resolve, reject) {
        return q.then(function (results) {
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
      var q = this.getQuery(options);
      q.count();

      var self = this;
      return new Promise(function (resolve, reject) {
        return q.then(function (results) {
          if (results.length === 0) {
            return resolve(null);
          }

          var firstKey = _.first(_.keys(results[0]));
          var count = results[0][firstKey];

          return resolve(count);
        }).catch(reject);
      });
    }

    findList(options = {}) {
      var model = this.model();
      if (!_.isArray(options.fields)) {
        options.fields = [
          model.primaryKey,
          model.displayField
        ];
      }

      var q = this.getQuery(options);

      var self = this;
      return new Promise(function (resolve, reject) {
        return q.then(function (results) {
          var list = {};

          _.each(results, function (v, k) {
            var listK = v[model.primaryKey];
            var listV = v[model.displayField];
            list[listK] = listV;
          });

          return resolve(list);
        }).catch(reject);
      });
    }
  }

  return Collection;
}
