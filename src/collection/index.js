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

    getTable() {
      var exp = this.table;
      var alias = this.model().alias;
      if (alias) {
        exp += ' as ' + alias;
      }
      return this.database().connection()(exp);
    }

    find(type = 'first', options = {}) {
      if (!this.finders[type] || !_.isFunction(this[this.finders[type]])) {
        throw new Error('Invalid find type');
      }

      return this[this.finders[type]](options);
    }

    findAll(options = {}) {
      var table = this.getTable();
      var self = this;
      return new Promise(function (resolve, reject) {
        return table.then(function (results) {
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

    }

    findCount(options = {}) {

    }
  }

  return Collection;
}
