var MemoryAdapter = require('./adapters/Memory');

module.exports = {
  adapter: MemoryAdapter,
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'firenze',
  pool: {
    min: 0,
    max: 1
  }
};
