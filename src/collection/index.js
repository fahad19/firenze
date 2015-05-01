var _ = require('lodash');

module.exports = function (_options = {}) {
  class Collection {
    constructor(extend = {}) {
      this.modelClass = null;
      this.table = null;
      this.alias = null;
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
  }

  return Collection;
}
