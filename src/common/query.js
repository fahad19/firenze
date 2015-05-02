var _ = require('lodash');

module.exports = {
  get: function (collection, options) {
    var exp = collection.table;
    var alias = collection.model().alias;
    if (alias) {
      exp += ' as ' + alias;
    }
    var query = collection.database().connection()(exp);
    query = this.applyOptions(query, options);
    return query;
  },

  applyOptions: function (query, options) {
    query = this.applyConditions(query, options);
    query = this.applyOrder(query, options);
    return query;
  },

  applyConditions: function (query, options = {}) {
    var conditions = _.isObject(options.conditions) ? options.conditions : null;
    _.each(conditions, function (v, k) {
      query.where(k, v);
    });

    return query;
  },

  applyOrder: function (query, options = {}) {
    var order = _.isObject(options.order) ? options.order : {};
    _.each(order, function (v, k) {
      query.orderBy(k, v);
    });
    return query;
  }
}
