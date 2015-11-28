import P from 'bluebird';

// # Query
//
// The query builder.
//
// ## Example usage
//
// ```js
// db.query()
//   .select('id', 'title')
//   .from('posts', 'Post')
//   .where({
//     id: 1
//   })
//   .offset(0)
//   .limit(10)
//   .all() // or .first()
//   .then(function (results) {
//
//   });
// ```
//
export default class Query {
  constructor(adapter) {
    this.adapter = adapter;
  }

  select(fields) { return this; }

  from() { return this; }

  where() { return this; }

  andWhere() { return this; }

  orWhere() { return this; }

  groupBy() { return this; }

  orderBy() { return this; }

  offset() { return this; }

  limit() { return this; }

  create() { return this; }

  update() { return this; }

  delete() { return this; }

  table() { return this; }

  expr() { return this; }

  all() { return new P.resolve(true); }

  first() { return new P.resolve(true); }

  run() { return new P.resolve(true); }
}
