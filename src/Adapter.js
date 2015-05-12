import _ from 'lodash';
import async from 'async';
import P from 'bluebird';

// # Adapter
//
// Adapter is responsible for making the actual database operations.
//
// ## Available
//
// You can find further documentation on querying on their own sites:
//
// * [MySQL](https://github.com/fahad19/firenze-adapter-mysql)
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

  }

// ### closeConnection(cb = null)
//
// Closes the current connection, and calls the callback function `cb()` if passed.
//
  closeConnection(cb = null) {
    return new P(function (resolve, reject) {
      return resolve();
    }).then(function () {
      if (_.isFunction(cb)) {
        return cb();
      }
    });
  }

// ### query()
//
// Gets a query object
//
  query(options = {}) { //eslint-disable-line
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### create(q, obj)
//
// Creates a new record
//
  create(q, obj) { //eslint-disable-line
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### read(q)
//
// Fetches the results found against the query object
//
  read(q) { //eslint-disable-line
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### update(q, obj)
//
// Updates the records matching againt query object with given data
//
  update(q, obj) { //eslint-disable-line
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### delete(q)
//
// Deletes the records matching against query object
//
  delete(q) { //eslint-disable-line
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### dropTable(model)
//
// Drop table if exists
//
  dropTable(model) {
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### createTable(model)
//
// Create table based on model's schema
//
  createTable(model) {
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### populateTable(model, rows)
//
// Insert rows into model's table
//
  populateTable(model, rows) {
    return new P(function (resolve, reject) {
      return resolve();
    });
  }

// ### loadFixture(model, rows)
//
// Creates table, and loads data for given model
//
  loadFixture(model, rows) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.series([
        (callback) => {
          this.dropTable(model)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            })
        },
        (callback) => {
          this.createTable(model)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            })
        },
        (callback) => {
          this.populateTable(model, rows)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            })
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
// Runs fixtures for multiple models
//
// arr = [{model: post, rows: rows}]
//
  loadAllFixtures(arr) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.map(arr, (fixture, callback) => {
        this.loadFixture(fixture.model, fixture.rows).then(function (results) {
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
