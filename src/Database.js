import _ from 'lodash';

import Collection from './Collection'
import Model from './Model'

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
//   user: '',
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

    let self = this;

// ## Methods
//
// ### createCollectionClass(extend)
//
// Also aliased as `.Collection(extend)`.
//
    this.createCollectionClass = this.Collection = function (extend) {
      class GeneratedCollection extends Collection {
        constructor(_extend = {}) {
          super(_extend);

          if (!this.getDatabase()) {
            this.setDatabase(self);
          }

          _.merge(this, extend);
        }
      }

      return GeneratedCollection;
    };

// ### createModelClass(extend)
//
// Also aliased as `.Model(extend)`
//
    this.createModelClass = this.Model = function (extend) {
      class GeneratedModel extends Model {
        constructor(attributes = {}, _extend = {}) {
          super(attributes, _extend);
          _.merge(this, extend);
        }
      }

      return GeneratedModel;
    };
  }

// ### getAdapter()
//
// Returns adapter
//
  getAdapter() {
    return this.adapter;
  }

// ### getConnection()
//
// Returns connection of the Adapter
//
  getConnection() {
    return this.getAdapter().getConnection();
  }

// ### close(cb = null)
//
// Closes the connection
//
  close(cb = null) {
    return this.getConnection().destroy(cb);
  }
}
