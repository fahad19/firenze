// for testing bin only
var firenze = require('../');
var SqlAdapter = require('../lib/adapters/Sql').default;

module.exports = new firenze.Database({
  adapter: SqlAdapter,

  host: process.env.FIRENZE_DB_HOST || '127.0.0.1',
  user: process.env.FIRENZE_DB_USER || 'root',
  port: process.env.FIRENZE_DB_PORT || 3306,
  password: process.env.FIRENZE_DB_PASS || '',
  database: process.env.FIRENZE_DB || 'firenze',

  pool: {
    min: 0,
    max: 5
  },

  migrations: {
    table: 'migrations',
    directory: __dirname + '/_migrations'
  }
});
