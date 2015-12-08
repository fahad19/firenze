### Expression Usage

```js
db.query()
  .from('posts')
  .where(function (expr) {
    // `expr` here in an Expression object
    expr
     .eq('author_id', 1)    // WHERE author_id = 1
     .notEq('published', 1) // AND published != 1
  })
  .run();
```
