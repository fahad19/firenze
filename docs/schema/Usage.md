# Schema Usage

You can get an instance of the Schema class via your Database instance:

```js
var schema = db.schema();
```

Now you have access to methods like, creating or dropping tables for example:

```js
db.schema()
  .dropTable('posts')
  .then(function () {
    console.log('Successfully dropped the table');
  });
```
