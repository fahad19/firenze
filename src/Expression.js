// ## Expression
//
// Expression class is responsible for handling all sorts of conditions that make up a Query object.
//
// An instance of Expression object is passed into functions like `where()`, `andWhere()`, etc.
//
// ### Usage
//
// ```js
// db.query()
//   .from('posts')
//   .where(function (expr) {
//     // `expr` here in an Expression object
//     expr
//      .eq('author_id', 1)    // WHERE author_id = 1
//      .notEq('published', 1) // AND published != 1
//   })
//   .run();
// ```
//
// ### Creating classes
//
// Unless you are building an Adapter, you wouldn't be required to create an Expression class.
//
// Example in ES6:
//
// ```js
// import {Expression} from 'firenze';
//
// export default class CustomExpression extends Expression {
//   // ...
// }
// ```
//
export default class Expression {
  constructor(query) {
// ### Properties
//
// #### query
//
// Current query object
//
    this.query = query;
  }

  eq() { return this; }

  notEq() { return this; }

  lt() { return this; }

  lte() { return this; }

  gt() { return this; }

  gte() { return this; }

  isNull() { return this; }

  isNotNull() { return this; }

  in() { return this; }

  notIn() { return this; }

  like() { return this; }

  notLike() { return this; }

  between() { return this; }

  notBetween() { return this; }

  count() { return this; }

  and() { return this; }

  or() { return this; }

  not() { return this; }
}
