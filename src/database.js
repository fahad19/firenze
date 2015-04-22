var _ = require('lodash');

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
  }

  connection() {
    return this.knex;
  }
}

module.exports = Database;
