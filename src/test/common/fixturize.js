var _ = require('lodash');

module.exports = function (model, rows) {
  var connection = model.collection().database().connection();
  var table = model.collection().table;

  connection.schema.dropTableIfExists(table);
  connection.schema.createTable(table, function (t) {
    _.each(model.schema, function (column, name) {
      t[column.type](name);
    });
  });
};
