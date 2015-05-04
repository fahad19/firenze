var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function (_options) {
  class Model {
    constructor(extend = {}) {
      this.collectionClass = null;
      this.schema = {};
      this.attributes = {};
      this.primaryKey = 'id';
      this.displayField = null;
      this.id = null;
      _.merge(this, _options, extend);

      var id = this.get(this.primaryKey);
      if (id) {
        this.id = id;
      }
    }

    collection(options = {}) {
      if (!this.collectionClass) {
        return new Error('Cannot find any collectionClass');
      }

      var isInstance = function (i) {
        return !_.isFunction(i) && _.isString(i.table);
      };

      var C = this.collectionClass;

      C = new C(options);
      if (isInstance(C)) {
        return C;
      }

      C = new C(options);
      if (isInstance(C)) {
        return C;
      }

      return new C(options);
    }

    get(field) {
      return this.attributes[field];
    }

    fetch(options = {}) {
      var id = this.id || this.get(this.primaryKey);
      if (!id) {
        throw new Error('No ID found');
      }

      var collection = this.collection();
      _.merge(options, {
        conditions: {
          [this.alias + '.' + this.primaryKey]: id
        }
      });
      return new Promise(function (resolve, reject) {
        return collection.find('first', options).then(function (model) {
          resolve(model);
        }).catch(reject);
      });
    }
  }

  return Model;
};
