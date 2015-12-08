# Database Usage

```js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');

var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: 'root',
  password: '',
  pool: {
    min: 0,
    max: 1
  }
});
```
