var _ = require('lodash');

var defaultOptions = {
  type: 'mysql',
  host: null,
  username: null,
  password: null,
  prefix: null
};

class Database {
  constructor(options = {}) {
    this.options = _.merge(defaultOptions, options);
  }
}

module.exports = Database;
