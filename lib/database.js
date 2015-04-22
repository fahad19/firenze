'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ = require('lodash');

var Database = (function () {
  function Database() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Database);

    this.defaultOptions = {
      type: 'mysql',
      host: null,
      user: null,
      database: null,
      password: null,
      prefix: null
    };

    this.options = _.merge(this.defaultOptions, options);

    this.knex = require('knex')({
      client: this.options.type,
      connection: _.pick(this.options, ['host', 'user', 'password', 'database', 'prefix'])
    });
  }

  _createClass(Database, [{
    key: 'connection',
    value: function connection() {
      return this.knex;
    }
  }]);

  return Database;
})();

module.exports = Database;