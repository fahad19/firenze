var _ = require('lodash');

module.exports = {
  get: function (collection, options) {
    var exp = collection.table;
    var alias = collection.model().alias;
    if ((_.isUndefined(options.alias) || options.alias) && alias) {
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
    var self = this;
    _.each(conditions, function (v, k) {
      k = _.trim(k);

      if (k === 'AND') {
        query.where(function () {
          self.applyConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'OR') {
        query.orWhere(function () {
          self.applyConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'NOT') {
        query.whereNot(function () {
          self.applyConditions(this, {
            conditions: v
          });
        });
      } else if (_.includes(k, ' ')) {
        var parts = k.split(' ');
        var field = parts[0];
        var operator = parts[1];

        if (_.isNull(v) && _.includes(['!=', '<>'], operator)) {
          query.whereNotNull(field);
        } else if (_.isArray(v) && _.includes(['!='], operator)) {
          query.whereNotIn(field, v);
        } else {
          query.where(field, operator, v);
        }
      } else {
        if (_.isNull(v)) {
          query.whereNull(k);
        } else if (_.isArray(v)) {
          query.whereIn(k, v);
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

    _.each(fields, function (v) {
      query.select(v);
    });
    return query;
  }
};
