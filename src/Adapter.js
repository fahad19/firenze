import _ from 'lodash';
import async from 'async';
import P from './Promise';

import Query from './Query';
import Schema from './Schema';

export default class Adapter {
  constructor(extend = {}) { //eslint-disable-line
    this.queryClass = Query;
    this.schemaClass = Schema;

    _.merge(this, extend);
  }

  getConnection() {
    return null;
  }

  closeConnection() {
    return new P(function (resolve) {
      return resolve();
    });
  }

  query(options = {}) {
    return new this.queryClass({
      ...options,
      adapter: this
    });
  }

  transaction(func) {
    return new P((resolve, reject) => {
      func.apply(this, [null])
        .then(resolve)
        .catch(reject);
    });
  }

  schema() {
    return new this.schemaClass(this);
  }

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

  loadFixture(collection, rows) { //eslint-disable-line
    return new P((resolve, reject) => {
      async.series([
        (callback) => {
          this.schema().dropTableOfCollection(collection)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        (callback) => {
          this.schema().createTableFromCollection(collection)
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
