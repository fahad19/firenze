var Mysql = require('../adapters/Mysql');

module.exports = {
  mysql: {
    adapter: Mysql,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'firenze',
    pool: {
      min: 0,
      max: 1
    }
  }
};
