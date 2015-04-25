var _ = require('lodash');

class Model {
  constructor(options = {}) {
    this.defaultOptions = {
      collectionClass: null,
      schema: {},
      primaryKey: 'id'
    };
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

module.exports = Model;
