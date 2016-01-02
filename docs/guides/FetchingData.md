# Fetching Data

Now that we have some files in place already, let's get into real action.

From the [file structure](./FileStructure.md) we are following, our custom code will go to `./index.js` for now.


## List

```js
// import the Collection
var Posts = require('./collections/Posts');

// lets instantiate it
var posts = new Posts();

// fetch list of posts
posts.find()
  .all()
  .then(function (models) {
    // `models` is an array of Post model's instances
    models.forEach(function (model) {
      var title = model.get('title');
      var titleLength = model.lengthOfTitle(); // the method we defined ourselves

      console.log(title, titleLength);
    });
  });
```

If you have any rows in your `posts` table, they will be shown in your Terminal if you run:

```
$ node index.js
```

## Single record

```js
posts.find()
  .first()
  .then(function (model) {
    var title = model.get('title');

    console.log(title);
  });
```

`.find()` method of Collection returns a [Query](../query) object, which you can read further in its own section.

You can also fetch a record from Model level:

```js
var post = posts.model({id: 1});

post.fetch()
  .then(function (model) {
    var title = model.get('title');
  });
```

## Conditions

```js
posts.find()
  .where({
    published: 1
  })
  .all()
  .then(function (models) {
    // ...
  });
```

Complex conditions are made available via [Expression](../expression) objects:

```js
posts.find()
  .where(function (expr) {
    expr
      .gt('id', 100) // `id` is greater than 100
      .isNotNull('title')
      .and(function (expr) {
        expr
          .between('created', '2015-12-01 12:00:00', '2016-01-01 15:00:00')
          .in('author_id', [1, 2, 3]) // `author_id` is either 1, 2, or 3
      });
  })
  .all()
  .then(function (models) {
    // ...
  });
```

Read more in [Expression](../expression) section for complex conditions.

## Pagination

Paginate the result set:

```js
posts.find()
  .limit(10)
  .page(2)
  .all()
  .then(function (models) {
    // ...
  });
```

Offsetting is possible too:

```js
posts.find()
  .limit(10)
  .offset(5)
  .all()
  .then(function (model) {
    // ...
  });
```

## Sorting

Sort the result set:

```js
posts.find()
  .orderBy('id', 'asc')
  .all()
  .then(function (models) {
    // ...
  });
```

## Count

Count the total number of rows matching this Query's conditions:

```js
posts.find()
  .where({
    published: 1
  })
  .count()
  .then(function (count) {
    console.log('Total number of published posts:', count);
  });
```

## Selecting fields

Select only a certain list of fields:

```js
posts.find()
  .select(['id', 'title'])
  .all()
  .then(function (models) {
    // ...
  });
```

Read more about field selection [here](../query/Methods.html#select).

## Applying column functions

Some database environments allow functions on column names when querying. For e.g., MySQL allows functions like `TRIM()`, `UPPER()`, etc.

They can be performed as follows:

```js
posts.find()
  .select('id', function (column) {
    return column('title')
      .upper()
      .trim();
  })
  .first()
  .then(function (model) {
    // ...
  });
```

Read more about it in [Functions](../functions) section.

## Query objects

You are not limited to always using a Collection when making database operations (including fetching data). You can make use of the Query object direct from the Database:

```js
db.query()
  .table('posts')
  .where({
    published: 1
  })
  .run()
  .then(function (rows) {
    // `rows` is an array of plain objects here
    rows.forEach(function (row) {
      console.log(row.title);
    });
  })
```
