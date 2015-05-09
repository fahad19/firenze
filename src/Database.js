var _ = require('lodash');

var Collection = require('./Collection');
var Model = require('./Model');

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

    var config = {
      client: this.options.type,
      connection: _.pick(this.options, [
        'host',
        'user',
        'password',
        'database',
        'prefix'
      ])
    };

    if (this.options.pool) {
      config.pool = this.options.pool;
    }

    this.knex = require('knex')(config);
    var self = this;

    this.createCollectionClass = this.Collection = function (extend) {
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

    this.createModelClass = this.Model = function (extend) {
      class GeneratedModel extends Model {
        constructor(attributes = {}, _extend = {}) {
          super(attributes, _extend);
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
