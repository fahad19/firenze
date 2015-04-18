'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _ = require('lodash');

var defaultOptions = {
  type: 'mysql',
  host: null,
  username: null,
  password: null,
  prefix: null
};

var Database = function Database() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Database);

  this.options = _.merge(defaultOptions, options);
};

module.exports = Database;