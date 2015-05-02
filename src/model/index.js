var _ = require('lodash');

module.exports = function (_options) {
  class Model {
    constructor(extend = {}) {
      this.collectionClass = null;
      this.schema = {};
      this.attributes = {};
      this.primaryKey = 'id';
      _.merge(this, _options, extend);
    }

    collection(options = {}) {
      if (!this.collectionClass) {
        return new Error('Cannot find any collectionClass');
      }

      var isInstance = function (i) {
        return !_.isFunction(i) && _.isString(i.table);
      };

      var C = new this.collectionClass(options);
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
  }

  return Model;
};
