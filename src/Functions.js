// ## Functions
//
// Functions class is an abstraction layer allowing you to perform database specific functions on columns.
//
// ### Usage
//
// You can make use of functions from your Query object as follows:
//
// ```js
// db.query()
//   .from('posts')
//   .select('id', function (column) {
//     // `column` is in instance of `Functions` class here
//     return column('title')
//       .upper() // uppercase the `title` column
//       .trim(); // and also trim the `title` column
//   })
//   .run();
// ```
//
// You can also call it directly from the Query object if you already have it as a variable first:
//
// ```js
// var query = db.query();
//
// query
//   .from('posts')
//   .select('id', {
//     title: query.func('title')
//       .upper()
//       .trim()
//   })
//   .run()
// ```
//
// ### Creating classes
//
// Functions classes come from the Adapters. If you are building one yourself, you would optionally want to create one too.
//
// Example in ES6:
//
// ```js
// import {Functions} from 'firenze';
//
// export default class CustomFunctions extends Functions {
//   // ...
// }
// ```
//

export default class Functions {
  constructor(...args) {
// ### Properties
//
// #### query
//
// The current query object
//
    this.query = args[0];

// #### column
//
// Currently chosen column name
//
    this.column = args[1];

    this.funcs = [];
  }

// ### Methods
//
  addFunction(funcName) {
    this.funcs.push(funcName);

    return this;
  }

// #### setColumn(column)
//
// Set column name
//
  setColumn(column) {
    this.column = column;

    return this;
  }

  upper() { return this; }

  lower() { return this; }

  concat() { return null; }

  sum() { return this; }

  avg() { return this; }

  min() { return this; }

  max() { return this; }

  count() { return this; }

  now() { return null; }

  toString() { return null; }
}
