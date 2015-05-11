var _ = require('lodash');

// # Adapter
//
// Adapter is responsible for making the actual database operations.
//
// ## Available
//
// * MySQL
//

class Adapter {
// ## Usage
//
// You would hardly ever need to create an instance of a Adapter. Database class would take care of it.
//
// An adapter instance is created with the same options passed when creating a Database instance:
//
// ```js
// var adapter = new lib.Adapter(options);
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
    if (_.isFunction(cb)) {
      cb();
    }
  }

// ### query()
//
// Gets a query object
//
  query(options = {}) { //eslint-disable-line

  }

// ### create(q, obj)
//
// Creates a new record
//
  create(q, obj) { //eslint-disable-line

  }

// ### read(q)
//
// Fetches the results found against the query object
//
  read(q) { //eslint-disable-line

  }

// ### update(q, obj)
//
// Updates the records matching againt query object with given data
//
  update(q, obj) { //eslint-disable-line

  }

// ### delete(q)
//
// Deletes the records matching against query object
//
  delete(q) { //eslint-disable-line

  }

// ### loadFixture(model, rows)
//
// Creates table, and loads data for given model
//
  loadFixture(model, rows) { //eslint-disable-line

  }

// ### loadAllFixtures(arr)
//
// Runs fixtures for multiple models
//
// arr = [{model: post, data: rows}]
//
  loadAllFixtures(arr) { //eslint-disable-line

  }
}

module.exports = Adapter;
