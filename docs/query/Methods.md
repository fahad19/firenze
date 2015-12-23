# Query Methods

### setAdapter(adapter)

Sets adapter to given one

### getAdapter()

Returns currently set Adapter instance

### setCollection(collection)

Sets collection to given one

### expr()

Read more in Expression section.

Returns a new Expression object

### func()

Read more in Functions section.

Returns a new Functions object

### all()

Returns a promise, resolving with an array of results after execution

### first()

Returns a promise, resolving with with a single object result after execution

### run()

Returns a promise, with the direct result of execution

### toModels(results)

Converts results to model(s), if query is for a Collection

### toModel(result)

Alias to `.toModels()`

### tap(fn)

Taps into the query builder chain, so you can perform something in between.

Example:

```js
db.query()
  .select('id', 'title')
  .tap(function () {
    // `this` is the Query object here
  })
  .run()
```

### select()

Selects columns to be fetched.

Can be called in various ways.

#### Array

```js
query.select(['id', 'title']);
```

#### Arguments

```js
query.select('id', 'title');
```

#### Object

```js
query.select('id', {
  someTitle: 'title' //
}); // `SELECT id, title as someTitle`
```

#### Function

```js
query.select('id', function (column) {
  return column('title')
    .upper()
    .trim();
}); // `SELET id, TRIM(UPPER(title))`
```

Read more about column Functions in its own section.

### distinct(fields)

Selects DISTINCT columns given as an array

### from (table, alias = null)

Specify the table where to fetch results from

* `.from('users')` would result in `SELECT * FROM users`
* `.from('users', 'User')` would result in `SELECT * FROM users AS User`

### table(table)

Not all query operations are SELECTs, but still require setting a table.

`.table()` can be used in those scenarios.

### where()

Sets conditions to the Query object.

Conditions can be set in various ways. For e.g, the same query for finding results where `id = 1` can be written as follows:

**Plain object**:

```js
query.where({
  id: 1
});
```

**Function**:

```js
query.where(function (expr) {
  // `expr` is an Expression object here
  expr.eq('id', 1);
});
```

Read more about Expressions in its own section.

### andWhere()

Same as `.where()` but with `AND` operator

### orWhere()

Same as `.where()` but with `OR` operator

### notWhere()

Same as `.where()` but with `NOT` operator

### limit(number)

Limit query results

### page(number)

Call it only if `.limit()` was called before.

Paginates results to certain page.

### offset(number)

Offsets results. Do not use it together with `.page()`.

### orderBy(name, direction)

Accepts options in two ways:

**Arguments**

```js
query.orderBy('created', 'asc');
```

***Object**

```js
query.orderBy({
  created: 'asc'
});
```

### groupBy(column)

Groups results set by given column.

Can be a string or an array of columns.

### count()

Count the number of results

Example:

```js
query
  .from('users')
  .where({active: 1})
  .count()
  .run()
  .then(function (count) {
    // `count` is an integer here
  });
```

### truncate()

Empties a table.

### create(row)

Insert a single or multiple objects into the table

### update(row)

Update with given row

### delete()

Delete records based on current Query conditions

### join(options)

Base method for joining tables.

For example, a LEFT join:

```js
query
  .select('*')
  .from('posts', 'Post')
  .join({
    type: 'LEFT',
    table: 'authors',
    alias: 'Author',
    on: function (expr) {
      expr.eq('Post.author_id', 'Author.id');
    }
  })
  .run()
```

You can also pass `nest: true` to avoid overriding column values, by returning the results nested per table.

There are also other handy methods for various kinds of JOINs

### innerJoin(options)

Wrapper for `INNER` join.

### leftJoin(options)

Wrapper for `LEFT` join.

### leftOuterJoin(options)

Wrapper for `LEFT OUTER` join.

### rightJoin(options)

Wrapper for `RIGHT` join.

### rightOuterJoin(options)

Wrapper for `RIGHT OUTER` join.

### outerJoin(options)

Wrapper for `OUTER` join.

### fullOuterJoin(options)

Wrapper for `FULL OUTER` join.

### debug()

Prints out the currently developed Query as a string in console
