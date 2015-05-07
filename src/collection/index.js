var _ = require('lodash');
var Promise = require('bluebird');

var query = require('./query');

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
    _.merge(this, extend);
  }

  model(attributes = {}, extend = {}) {
    if (!this.modelClass) {
      return new Error('Cannot find any modelClass');
    }

    var isInstance = function (i) {
      return !_.isFunction(i) && _.isObject(i.schema);
    };

    var M = this.modelClass;

    M = new M(attributes, extend);
    if (isInstance(M)) {
      return M;
    }

    M = new M(attributes, extend);
    if (isInstance(M)) {
      return M;
    }

    return new M(attributes, extend);
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
        _.each(results, function (v) {
          models.push(self.model(v));
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

        return resolve(self.model(results[0]));
      }).catch(reject);
    });
  }

  findCount(options = {}) {
    var q = this.getQuery(options);
    q.count();

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

    return new Promise(function (resolve, reject) {
      return q.then(function (results) {
        var list = {};

        _.each(results, function (v) {
          var listK = v[model.primaryKey];
          var listV = v[model.displayField];
          list[listK] = listV;
        });

        return resolve(list);
      }).catch(reject);
    });
  }

  save(model, options = {}) {
    var obj = model.toObject();
    var q = this.getQuery({
      alias: false
    });
    var self = this;
    return new Promise(function (resolve, reject) {
      if (model.isNew()) {
        q.insert(obj);
      } else {
        obj = _.omit(obj, model.primaryKey);
        if (_.isArray(options.fields)) {
          obj = _.pick(obj, options.fields);
        }

        q
          .where(model.primaryKey, '=', model.getId())
          .update(obj);
      }

      q.then(function (ids) {
        var id = null;
        if ((_.isArray(ids) && ids.length === 0) || !ids) {
          return resolve(id);
        } else if (_.isArray(ids)) {
          id = ids[0];
        } else {
          id = ids;
        }

        return self.model({id: id}).fetch().then(function (m) {
          resolve(m);
        }).catch(function (error) {
          reject(error);
        });
      }).catch(reject);
    });
  }

  delete(model) {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (model.isNew()) {
        var error = new Error('Cannot delete a model without ID');
        return reject(error);
      }

      var q = self.getQuery({
        alias: false
      });

      return q
        .where(model.primaryKey, '=', model.getId())
        .del()
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Collection;
