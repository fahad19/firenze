import _ from 'lodash';
import async from 'async';
import P from './Promise';

import Query from './Query';
import Schema from './Schema';

// # Adapter
//
// Adapter is responsible for making the actual database operations.
//

export default class Adapter {
// ## Usage
//
// You would hardly ever need to create an instance of an Adapter. Database class would take care of it.
//
// An adapter instance is created with the same options passed when creating a Database instance:
//
// For example, if you are using MySQL adapter, it would be like this:
//
// ```
// $ npm install --save firenze-adapter-mysql
// ```
//
// Now let's create an instance of Database:
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
//   password: ''
// });
// ```
//
  constructor(extend = {}) { //eslint-disable-line
    this.queryClass = Query;
    this.schemaClass = Schema;

    _.merge(this, extend);
  }

// ## Methods
//
// Every adapter needs to implement at least these methods below:
//
// ### getConnection()
//
// Returns the current connection
//
  getConnection() {
    return null;
  }

// ### closeConnection()
//
// Closes the current connection.
//
// Returns a promise.
//
  closeConnection() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### query()
//
// Returns a new query object
//
  query(options = {}) {
    return new this.queryClass({
      ...options,
      adapter: this
    });
  }

// ### schema()
//
// Returns Schema object
//
  schema() {
    return new this.schemaClass(this);
  }

// ### populateTable(collection, rows)
//
// Inserts rows into collection's table
//
// Returns a promise
//
  populateTable(collection, rows) {
    return new P((resolve, reject) => {
      this.query()
        .table(collection.table)
        .create(rows)
        .run()
        .then(resolve)
        .catch(reject);
    });
  }

// ### loadFixture(collection, rows)
//
// Drops and creates table, and loads data for given collection
//
// Returns a promise.
//
  loadFixture(collection, rows) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.series([
        (callback) => {
          this.schema().dropTable(collection)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        (callback) => {
          this.schema().createTable(collection)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        (callback) => {
          this.populateTable(collection, rows)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        }
      ], function (err, results) {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      });
    });
  }

// ### loadAllFixtures(arr)
//
// Runs fixtures for multiple collections
//
// `arr` should be in the format of `[{collection: posts, rows: rows}]`
//
// Returns a promise.
//
  loadAllFixtures(arr) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.map(arr, (fixture, callback) => {
        this.loadFixture(fixture.collection, fixture.rows).then(function (results) {
          callback(null, results);
        }).catch(function (error) {
          callback(error);
        });
      }, function (err, results) {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      });
    });
  }
}
