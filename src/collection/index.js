var _ = require('lodash');

module.exports = function (_options = {}) {
  class Collection {
    constructor(options = {}) {
      this.defaultOptions = _.merge({
        modelClass: null,
        table: null,
        alias: null
      }, _options);
      this.options = _.merge(this.defaultOptions, options);
    }

    model(options = {}) {
      if (!this.modelClass) {
        return new Error('Cannot find any modelClass');
      }

      var M = new this.modelClass(options);
      if (!_.isFunction(M)) {
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
