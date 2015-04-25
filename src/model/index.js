var _ = require('lodash');

module.exports = function (_options) {
  class Model {
    constructor(options = {}) {
      this.defaultOptions = _.merge({
        collectionClass: null,
        schema: {},
        primaryKey: 'id'
      }, _options);
      this.options = _.merge(this.defaultOptions, options);
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
