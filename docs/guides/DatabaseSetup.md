# Database Setup

Instance of our Database will be heavily used throughout the application. So it is best to export it from somewhere that we can require on demand.

According to the file structure we saw before, we will store it in `./config/db.js`:

```js
// ./config/db.js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');

var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: '',
  password: ''
});

module.exports = db;
```
