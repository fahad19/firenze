# Expression Methods

Documentation as per SQL adapters below.

### eq(column, value)

Where column equals value.

### notEq(column, value)

Where column doesn't equal to value.

### lt(column, value)

Where column is less than value

### lte(column, value)

Where column is less than or equal to value

### gt(column, value)

Where column is greater than value

### gte(column, value)

Where column is greater than or equal to value

### like(column, value)

Where column is LIKE value.

Example:

```js
db.query()
  .from('posts')
  .where(function (expr) {
    expr.like('title', '%hello%'); // where `title` contains the text `hello`
  })
  .run();
```

### notLike(column, value)

Where column is not LIKE value.

### in(column, values)

Where column is one of the given values.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr.in('id', [1, 2, 3]); // where `id` is either 1, 2, or 3.
  });
```

### notIn(column, values)

Where column is not one of the given values

### isNull(column)

Where column is `null`

### isNotNull(column)

Where column is not `null`

### between(column, from, to)

Where column is between from and to.

Example:

```js
db.query()
  .from('posts')
  .where(function (expr) {
    expr.between('views_count', 1000, 2000); // where `views_count` is between 1000 and 2000
  })
  .run();
```
### notBetween(column, from, to)

Where column is not between from and to.

### and()

Nests further conditions with `AND` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .and(function (expr) {
        expr.eq('role_id', 2);
      });
  })
  .run();
```

### or()

Nests further conditions with `OR` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .or(function (expr) {
        expr.eq('super_admin', 1);
      });
  })
  .run();
```

### not()

Nests further conditions with `NOT` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .not(function (expr) {
        expr.eq('spammer', 1);
      });
  })
  .run();
```
