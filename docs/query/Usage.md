# Query Usage

For helping understanding better, we will be showing examples with SQL environments below.

```js
// create a new Query object
var query = db.query()
  .select('id', 'title') // select the columns `id` and `title`
  .from('posts', 'Post') // from `posts` table, as `Post`
  .where({ // conditions
    id: 1
  })
  .orderBy({
    id: 'asc' // order by the column `id` in ascending order
  })
  .limit(10); // limit the results set to `10`

// execute it
query.run()
  .then(function (results) {
    console.log(results);
  });
```

Majority of the methods are chainable.
