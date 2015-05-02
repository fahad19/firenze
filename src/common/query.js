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
    query = this.applyFields(query, options);
    query = this.applyOrder(query, options);
    query = this.applyGroup(query, options);
    return query;
  },

  applyConditions: function (query, options = {}) {
    var conditions = _.isObject(options.conditions) ? options.conditions : null;
    _.each(conditions, function (v, k) {
      k = _.trim(k);

      if (k === 'AND') {

      } else if (k === 'OR') {

      } else if (k === 'NOT') {

      } else if (_.includes(k, ' ')) {
        var parts = k.split(' ');
        var field = parts[0];
        var operator = parts[1];

        if (_.isNull(v) && _.includes(['!=', '<>'], operator)) {
          query.whereNotNull(field);
        } else {
          query.where(field, operator, v);
        }
      } else {
        if (_.isNull(v)) {
          query.whereNull(k);
        } else {
          query.where(k, v);
        }
      }
    });

    return query;
  },

  applyOrder: function (query, options = {}) {
    var order = _.isObject(options.order) ? options.order : {};
    _.each(order, function (v, k) {
      query.orderBy(k, v);
    });
    return query;
  },

  applyGroup: function (query, options = {}) {
    var group = _.isObject(options.group) ? options.group : [];
    _.each(group, function (v, k) {
      query.groupBy(k, v);
    });
    return query;
  },

  applyFields: function (query, options = {}) {
    var fields = _.isArray(options.fields) ? options.fields : [];
    if (fields.length === 0) {
      return query;
    }

    _.each(fields, function (v, k) {
      query.select(v);
    });
    return query;
  }
}
