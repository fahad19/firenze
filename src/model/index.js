var _ = require('lodash');

module.exports = function (_options) {
  class Model {
    constructor(extend = {}) {
      this.collectionClass = null;
      this.schema = {};
      this.primaryKey = 'id';
      _.merge(this, _options, extend);
    }

    collection(options = {}) {
      if (!this.collectionClass) {
        return new Error('Cannot find any collectionClass');
      }

      var C = new this.collectionClass(options);
      if (!_.isFunction(C)) {
        return C;
      }

      return new C(options);
    }
  }

  return Model;
};
