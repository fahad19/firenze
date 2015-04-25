'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _ = require('lodash');

var Base = function Base() {
  var options = arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Base);

  this.defaultOptions = this.defaultOptions || {};
  this.options = _.merge(this.defaultOptions, options);
};

module.exports = Base;