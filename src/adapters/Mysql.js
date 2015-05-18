import knex from 'knex';
import _ from 'lodash';
import P from 'bluebird';

import Adapter from '../Adapter';

// ## MySQL Adapter
//
// MySQL adapter for Firenze.js
//
// ### Install
//
// ```
// $ npm install --save firenze-adapter-mysql
// ```
//
// ### Usage
//
// You aren't expected to deal with the Adapter directly. Just pass the adapter to Database config when you create an instance.
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
//   password: '',
//   pool: {
//     min: 0,
//     max: 1
//   }
// });
// ```
//
// ### Schema
//
// When defining a Model's schema, you need to pass option for each column's `type`.
//
// Here are the supported types from this adapter:
//
// * increments
// * integer
// * bigInteger
// * text
// * string
// * float
// * decimal
// * boolean
// * date
// * dateTime
// * time
// * enum
// * binary
// * uuid
//
// Example:
//
// ```js
// var Post = db.createModelClass({
//   schema: {
//     id: {
//       type: 'increments'
//     }
//   }
// });
// ```
//
export default class Mysql extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;

    let config = {
      client: 'mysql',
      connection: _.pick(this.options, [
        'host',
        'user',
        'password',
        'database',
        'prefix'
      ])
    };

    if (this.options.pool) {
      config.pool = this.options.pool;
    }

    this.knex = knex(config);
  }

  getConnection() {
    return this.knex;
  }

  closeConnection(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    return this.getConnection().destroy(cb);
  }

  create(q, obj) {
    return q.insert(obj);
  }

// ### Finders
//
// Examples below assumes you have an instance of Collection already:
//
// ```js
// var posts = new Posts();
// ```
//
// #### first
//
// Gives you the first matched result:
//
// ```js
// posts.find('first', {
//   conditions: {
//     id: 1
//   }
// }).then(function (post) {
//   // post is now an instance of Post model
//   var title = post.get('title');
// });
// ```
//
// #### all
//
// Gives you all matched results:
//
// ```js
// posts.find('all', {
//   conditions: {
//     published: true
//   }
// }).then(function (models) {
//   models.forEach(function (model) {
//     var title = model.get('title');
//   });
// });
// ```
// #### list
//
// Gives you a list of key/value paired object of matched results:
//
// ```js
// posts.find('list', {
//   conditions: {},
//   fields: [
//     'id',
//     'title'
//   ]
// }).then(function (list) {
//   // list is now:
//   //
//   // {
//   //   1: 'Hello World',
//   //   2: 'About'
//   // }
// });
// ```
//
// #### count
//
// Gives you the total count of matched results:
//
// ```js
// posts.find('count').then(function (count) {
//   // count is an integer here
// });
// ```
//
  read(q) {
    return q;
  }

  update(q, obj) {
    return q.update(obj);
  }

  delete(q) {
    return q.del();
  }

  dropTable(model) {
    let connection = this.getConnection();
    let table = model.collection().table;

    return new P(function (resolve, reject) {
      connection.schema.dropTableIfExists(table)
        .then(function (response) {
          return resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  createTable(model) {
    let connection = this.getConnection();
    let table = model.collection().table;

    return new P(function (resolve, reject) {
      connection.schema.createTable(table, function (t) {
        _.each(model.schema, function (column, name) {
          t[column.type](name);
        });
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  populateTable(model, rows) {
    let connection = this.getConnection();
    let table = model.collection().table;

    return new P(function (resolve, reject) {
      connection(table).insert(rows)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  query(collection, options = {}) {
    let exp = collection.table;
    let alias = collection.model().alias;
    if ((_.isUndefined(options.alias) || options.alias) && alias) {
      exp += ' as ' + alias;
    }
    let query = collection.getDatabase().getConnection()(exp);
    query = this.queryOptions(query, options);
    return query;
  }

  queryOptions(query, options) {
    let apply = [
      'Conditions',
      'Fields',
      'Count',
      'Order',
      'Group',
      'Limit'
    ];

    apply.forEach((a) => {
      this['query' + a](query, options);
    });

    return query;
  }

// ### Complex conditions
//
// #### equals
//
// ```js
// posts.find('all', {
//   conditions: {
//     id: 1
//   }
// });
// ```
//
// #### in list
//
// ```js
// posts.find('all', {
//   conditions: {
//     id: [
//       1,
//       2,
//       3
//     ]
//   }
// });
// ```
//
// #### comparisons
//
// ```js
// posts.find('all', {
//   conditions: {
//     'Post.rating >': 3
//   }
// })
// ```
//
// Example comparisons that you can try:
//
// * greater than `ModelAlias.field >`
// * greater than or equel to `ModelAlias.field >=`
// * less than `ModelAlias.field <`
// * less than or equal to `ModelAlias.field <=`
// * not equal to `ModelAlias.field !=`
//
// #### AND
//
// ```js
// posts.find('all', {
//   conditions: {
//     AND: {
//       'Post.published': 1
//     }
//   }
// });
// ```
//
// #### OR
//
// ```js
// posts.find('all', {
//   conditions: {
//     OR: {
//       'Post.published': 1
//     }
//   }
// });
// ```
//
// #### NOT
//
// ```js
// posts.find('all', {
//   conditions: {
//     NOT: {
//       'Post.published': 1
//     }
//   }
// });
// ```
//
  queryConditions(query, options = {}) {
    let conditions = _.isObject(options.conditions) ? options.conditions : null;
    let self = this;
    _.each(conditions, function (v, k) {
      k = _.trim(k);

      if (k === 'AND') {
        query.where(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'OR') {
        query.orWhere(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (k === 'NOT') {
        query.whereNot(function () {
          self.queryConditions(this, {
            conditions: v
          });
        });
      } else if (_.includes(k, ' ')) {
        let parts = k.split(' ');
        let field = parts[0];
        let operator = parts[1];

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
  }

  queryOrder(query, options = {}) {
    let order = _.isObject(options.order) ? options.order : {};
    _.each(order, function (v, k) {
      query.orderBy(k, v);
    });
    return query;
  }

  queryGroup(query, options = {}) {
    let group = _.isObject(options.group) ? options.group : [];
    _.each(group, function (v, k) {
      query.groupBy(k, v);
    });
    return query;
  }

  queryFields(query, options = {}) {
    let fields = _.isArray(options.fields) ? options.fields : [];
    if (fields.length === 0) {
      return query;
    }

    _.each(fields, function (v) {
      query.select(v);
    });
    return query;
  }

  queryLimit(query, options = {}) {
    if (options.limit && options.page) {
      let limit = parseInt(options.limit, 10);
      let page = parseInt(options.page, 10);

      query
        .limit(limit)
        .offset((page - 1) * limit);
    } else if (options.limit) {
      query.limit(parseInt(options.limit, 10));
    }

    return query;
  }

  queryCount(query, options = {}) {
    if (options.count) {
      query.count();
    }

    return query;
  }
}
