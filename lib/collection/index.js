'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ = require('lodash');

module.exports = function () {
  var _options = arguments[0] === undefined ? {} : arguments[0];

  var Collection = (function () {
    function Collection() {
      var options = arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Collection);

      this.defaultOptions = _.merge({
        modelClass: null,
        table: null,
        alias: null
      }, _options);
      this.options = _.merge(this.defaultOptions, options);
    }

    _createClass(Collection, [{
      key: 'model',
      value: function model() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        if (!this.modelClass) {
          return new Error('Cannot find any modelClass');
        }

        var M = new this.modelClass(options);
        if (!_.isFunction(M)) {
          return M;
        }

        return new M(options);
      }
    }, {
      key: 'database',
      value: function database() {
        return this.db;
      }
    }, {
      key: 'setDatabase',
      value: function setDatabase(db) {
        this.db = db;
      }
    }]);

    return Collection;
  })();

  return Collection;
};