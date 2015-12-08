import _ from 'lodash';

import collectionFactory from './common/collectionFactory';
import P from './Promise';

// # Database
//
// Before anything else, you need to create an instance of `Database` with your credentials which will be referenced in your Collections and Models.
//
// ## Usage
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
// var MysqlAdapter = require('firenze-adapter-mysql');
//
// var db = new Database({
//   adapter: MysqlAdapter,
//   host: '127.0.0.1',
//   database: 'my_database',
//   user: 'root',
//   password: '',
//   pool: {
//     min: 0,
//     max: 1
//   }
// });
// ```

export default class Database {
  constructor(options = {}) {
    this.defaultOptions = {
      adapter: null,
      host: null,
      user: null,
      database: null,
      password: null,
      prefix: null
    };

    this.options = _.merge(this.defaultOptions, options);

    let AdapterClass = this.options.adapter;
    this.adapter = new AdapterClass(_.omit(this.options, 'adapter'));

// ## Methods
//
// ### createCollection(extend)
//
// Quickly create Collection class that references to current Database instance.
//
    this.createCollection = collectionFactory(this);
  }

// ### getAdapter()
//
// Returns adapter instance
//
  getAdapter() {
    return this.adapter;
  }

// ### query()
//
// Returns a new query builder of the Adapter
//
  query() {
    return this.adapter.query();
  }

// ### schema()
//
// Returns schema object for manipulating the Database
//
  schema() {
    return this.adapter.schema();
  }

// ### getConnection()
//
// Returns connection of the Adapter
//
  getConnection() {
    return this.getAdapter().getConnection();
  }

// ### close()
//
// Closes the connection
//
// Returns a promise
//
  close() {
    return new P((resolve) => {
      return this.getAdapter().closeConnection().then(() => {
        return resolve();
      });
    });
  }
}
