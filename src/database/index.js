var _ = require('lodash');

var Collection = require('../collection');
var Model = require('../model');

class Database {
  constructor(options = {}) {
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
      connection: _.pick(this.options, [
        'host',
        'user',
        'password',
        'database',
        'prefix'
      ])
    });

    var self = this;

    this.createCollectionClass = function (extend) {
      class GeneratedCollection extends Collection {
        constructor(_extend = {}) {
          super(_extend);

          if (!this.database()) {
            this.setDatabase(self);
          }

          _.merge(this, extend);
        }
      }

      return GeneratedCollection;
    };

    this.createModelClass = function (extend) {
      class GeneratedModel extends Model {
        constructor(_extend = {}) {
          super(_extend);
          _.merge(this, extend);
        }
      }

      return GeneratedModel;
    };
  }

  connection() {
    return this.knex;
  }

  close(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    return this.connection().destroy(cb);
  }
}

module.exports = Database;
