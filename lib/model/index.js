'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ = require('lodash');

module.exports = function (_options) {
  var Model = (function () {
    function Model() {
      var options = arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Model);

      this.defaultOptions = _.merge({
        collectionClass: null,
        schema: {},
        primaryKey: 'id'
      }, _options);
      this.options = _.merge(this.defaultOptions, options);
    }

    _createClass(Model, [{
      key: 'collection',
      value: function collection() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        if (!this.collectionClass) {
          return new Error('Cannot find any collectionClass');
        }

        var C = new this.collectionClass(options);
        if (!_.isFunction(C)) {
          return C;
        }

        return new C(options);
      }
    }]);

    return Model;
  })();

  return Model;
};