var _ = require('lodash');

var Collection = require('./Collection');
var Model = require('./Model');

// # Database
//
// Before anything else, you need to create an instance of `Database` with your credentials which will be referenced in your Collections and Models.
//
// ## Usage
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
//
// var db = new Database({
//   type: 'mysql',
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

class Database {
  constructor(options = {}) {
    this.defaultOptions = {
      type: 'Mysql',
      host: null,
      user: null,
      database: null,
      password: null,
      prefix: null
    };

    this.options = _.merge(this.defaultOptions, options);

    var DatasourceClass = require('./datasources/Mysql');
    this.datasource = new DatasourceClass(this.options);

    var self = this;

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

// ### getDatasource()
//
// Returns datasource
//
  getDatasource() {
    return this.datasource;
  }

// ### getConnection()
//
// Returns connection of the Datasource
//
  getConnection() {
    return this.getDatasource().getConnection();
  }

// ### close(cb = null)
//
// Closes the connection
//
  close(cb = null) {
    return this.getConnection().destroy(cb);
  }
}

module.exports = Database;
