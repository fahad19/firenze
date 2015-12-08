# Create Collection Class

You can create a Collection class from your Database instance. And it requires minimum one property: `table`:

```js
var Posts = db.createCollection({
  table: 'posts',

  // optional
  modelClass: Post
});
```

You can also create a Collection class independently:

```js
var Posts = f.createCollection({
  db: db, // instance of your Database

  table: 'posts'
});
```
