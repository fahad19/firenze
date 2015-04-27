var _ = require('lodash');

module.exports = function (model, rows) {
  var connection = model.collection().database().connection();
  var table = model.collection().options.table;

  console.log('dropping table', table);
  connection.schema.dropTableIfExists(table).catch(function (error) {
    console.log('error', error);
  });

  connection.schema.createTable(table, function (t) {
    console.log('running fixtures for table: ', table);
    _.each(model.options.schema, function (column, name) {
      t[column.type](name);
    });
  }).catch(function (error) {
    console.log('error', error);
  });
};
