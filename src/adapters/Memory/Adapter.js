/* eslint-disable new-cap */
import _ from 'lodash';

import {Adapter} from '../../';

import Query from './Query';
import Schema from './Schema';

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
  constructor(givenOptions = {}) {
    const options = {
      queryClass: Query,
      schemaClass: Schema,
      ...givenOptions
    };

    super(options);

    this.options = options;
    this.data = {};
  }

  getData(path = null) {
    if (!path) {
      return this.data;
    }

    return _.get(this.data, path);
  }

  setData(path = null, value = null) {
    return _.set(this.data, path, value);
  }

  getConnection() {
    return this.data;
  }
}
