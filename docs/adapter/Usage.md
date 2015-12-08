## Adapter Usage

You would hardly ever need to create an instance of an Adapter. Database class would take care of it.

An adapter instance is created with the same options passed when creating a Database instance:

For example, if you are using MySQL adapter, it would be like this:

```
$ npm install --save firenze-adapter-mysql
```

Now let's create an instance of Database:

```js
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
```
