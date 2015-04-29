var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');

module.exports = function (model, rows) {
  return new Promise(function (resolve, reject) {
    var connection = model.collection().database().connection();
    var table = model.collection().options.table;

    async.series([
      function (callback) {
        console.log('dropping table:', table);
        connection.schema.dropTableIfExists(table)
          .then(function (response) {
            callback(null, response);
          })
          .catch(function (error) {
            callback(error);
          });
      },
      function (callback) {
        console.log('creating schema:', table);
        connection.schema.createTable(table, function (t) {
          _.each(model.options.schema, function (column, name) {
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
        console.log('inserting data:', table);
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
};
