import async from 'async';
import P from './Promise';

// # Adapter
//
// Adapter is responsible for making the actual database operations.
//

export default class Adapter {
// ## Usage
//
// You would hardly ever need to create an instance of a Adapter. Database class would take care of it.
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
  constructor(options = {}) { //eslint-disable-line

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

// ### closeConnection(cb = null)
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
// Gets a query object
//
  query(options = {}) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### create(q, obj)
//
// Creates a new record
//
  create(q, obj) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### read(q)
//
// Fetches the results found against the query object
//
  read(q) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### update(q, obj)
//
// Updates the records matching againt query object with given data
//
  update(q, obj) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### delete(q)
//
// Deletes the records matching against query object
//
  delete(q) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### dropTable(model)
//
// Drop table if exists
//
  dropTable(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### createTable(model)
//
// Create table based on model's schema
//
  createTable(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### populateTable(model, rows)
//
// Insert rows into model's table
//
  populateTable(model, rows) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### loadFixture(collection, rows)
//
// Creates table, and loads data for given collection
//
  loadFixture(collection, rows) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.series([
        (callback) => {
          this.dropTable(collection)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        (callback) => {
          this.createTable(collection)
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
// arr = [{collection: post, rows: rows}]
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
