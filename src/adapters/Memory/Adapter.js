/* eslint-disable new-cap */

import _ from 'lodash';
import f from '../../';
import async from 'async';

let P = f.Promise;
let Adapter = f.Adapter;

// ## Usage
//
// ### Node.js
//
// With [npm](https://npmjs.com):
//
// ```
// $ npm install --save firenze-adapter-memory
// ```
//
// Now you can require it as follows:
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
// var MemoryAdapter = require('firenze-adapter-memory');
//
// var db = new Database({
//   adapter: MemoryAdapter
// });
// ```
//
// ### Browser
//
//
// Or [Bower](http://bower.io):
//
// ```
// $ bower installl --save firenze-adapter-memory
// ```
//
// Can be loaded in your HTML page as follows:
//
// ```js
// <script src="bower_components/lodash/lodash.min.js"></script>
// <script src="bower_components/async/lib/async.js"></script>
// <script src="bower_components/bluebird/js/browser/bluebird.min.js"></script>
// <script src="bower_components/validator-js/validator.min.js"></script>
//
// <script src="bower_components/firenze/dist/firenze.min.js"></script>
// <script src="bower_components/firenze-adapter-memory/dist/firenze-adapter-memory.min.js"></script>
//
// <script>
// // Memory adapter is availble in `firenze.MemoryAdapter`
// var db = new firenze.Database({
//   adapter: firenze.MemoryAdapter
// });
// </script>
// ```
//
export default class MemoryAdapter extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;
    this.data = {};
  }

  getConnection() {
    return this.data;
  }

  closeConnection() {
    return new P.resolve(true);
  }

  dropTable(collection) {
    this.data = _.omit(this.data, collection.table);
    return new P.resolve(true);
  }

  createTable(collection) {
    this.data[collection.table] = [];
    return new P.resolve(true);
  }

  populateTable(collection, rows) {
    this.data[collection.table] = _.clone(rows);
    return new P.resolve(true);
  }

  query(collection, options = {}) {
    let opt = _.merge(options, {
      table: collection.table,
      alias: collection.alias,
      primaryKey: collection.primaryKey
    });

    let promise = new P((resolve, reject) => {
      return this
        .findRecords(opt)
        .then((results) => {
          return resolve(results);
        })
        .catch((error) => {
          return reject(error);
        });
    });

    return _.merge(promise, opt);
  }
}
