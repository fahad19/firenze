# Functions Usage

You can make use of functions from your Query object as follows:

```js
db.query()
  .from('posts')
  .select('id', function (column) {
    // `column` is in instance of `Functions` class here
    return column('title')
      .upper() // uppercase the `title` column
      .trim(); // and also trim the `title` column
  })
  .run();
```

You can also call it directly from the Query object if you already have it as a variable first:

```js
var query = db.query();

query
  .from('posts')
  .select('id', {
    title: query.func('title')
      .upper()
      .trim()
  })
  .run()
```
