// Memory
// import MemoryAdapter from '../adapters/Memory';
//
// export default {
//   adapter: MemoryAdapter
// };

// MySQL
import SqlAdapter from '../src/adapters/Sql';

export default {
  adapter: SqlAdapter,
  client: 'mysql',

  host: '127.0.0.1',
  port: 3306,
  database: 'firenze',
  user: 'root',
  password: '',
  pool: {
    min: 0,
    max: 5
  }
}
