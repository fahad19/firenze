var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');

module.exports = {
  /**
   * Load fixtures in table
   *
   * @param Object model - instance of Model
   * @param array rows
   */
  load: function (model, rows) {
    return new Promise(function (resolve, reject) {
      var connection = model.collection().database().connection();
      var table = model.collection().table;

      async.series([
        function (callback) {
          connection.schema.dropTableIfExists(table)
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        function (callback) {
          connection.schema.createTable(table, function (t) {
            _.each(model.schema, function (column, name) {
              t[column.type](name);
            });
          })
            .then(function (response) {
              callback(null, response);
            })
            .catch(function (error) {
              callback(error);
            });
        },
        function (callback) {
          connection(table).insert(rows)
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
  },

  /**
   * Load a bunch of fixtures
   *
   * @param array arr - [{model: post, data: rows}]
   */
  loadAll: function (arr) {
    var self = this;
    return new Promise(function (resolve, reject) {
      async.map(arr, function (fixture, callback) {
        self.load(fixture.model, fixture.data).then(function (results) {
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
};
