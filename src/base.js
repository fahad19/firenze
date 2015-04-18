var _ = require('lodash');
var iterator = require('./util/objectIterator');

var defaultOptions = {
  behaviors: {}
};

class Base {
  constructor(options = {}) {
    this.options = _.merge(defaultOptions, options);
  }

  applyBehaviors() {
    for (var [key, value] of iterator(this.behaviors)) {
      this.applyBehavior(key, value);
    }
  }

  applyBehavior(name, behavior) {
    
  }
}

module.exports = Base;
