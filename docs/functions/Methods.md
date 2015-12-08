# Functions Methods

Documentation as per SQL adapters below.

### setColumn(column)

Set column name

<!--/docume:src/Functions.js-->

<!--docume:src/adapters/Sql/Functions.js-->
### upper()

Apply `UPPER()` function to column

### lower()

Apply `LOWER()` function to column

### sum()

Apply `SUM()` function to column

### avg()

Apply `AVG()` function to column

### min()

Apply `MIN()` function to column

### max()

Apply `MAX()` function to column

### count()

Apply `COUNT()` function to column

### now()

SQL equivalent of `NOW()`

### year()

Apply `YEAR()` function to column

### month()

Apply `MONTH()` function to column

### day()

Apply `DAY()` function to column

### week()

Apply `WEEK()` function to column

### weekday()

Apply `WEEKDAY()` function to column

### concat()

Apply `CONCAT()` function to column

Example:

```js
query.select({
  id_and_title: function (column) {
    return column.concat('id', JSON.stringify(' '), 'title');
  }
})
```

Now `id_and_title` field will be returned with `id` and `title` field's values separated by a space.
