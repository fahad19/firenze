/* eslint-disable new-cap */

import _ from 'lodash';
import f from '../../';
import async from 'async';

let P = f.Promise;
let Adapter = f.Adapter;

// ## Usage
//
// ### Node.js
//
// With [npm](https://npmjs.com):
//
// ```
// $ npm install --save firenze-adapter-memory
// ```
//
// Now you can require it as follows:
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
// var MemoryAdapter = require('firenze-adapter-memory');
//
// var db = new Database({
//   adapter: MemoryAdapter
// });
// ```
//
// ### Browser
//
//
// Or [Bower](http://bower.io):
//
// ```
// $ bower installl --save firenze-adapter-memory
// ```
//
// Can be loaded in your HTML page as follows:
//
// ```js
// <script src="bower_components/lodash/lodash.min.js"></script>
// <script src="bower_components/async/lib/async.js"></script>
// <script src="bower_components/bluebird/js/browser/bluebird.min.js"></script>
// <script src="bower_components/validator-js/validator.min.js"></script>
//
// <script src="bower_components/firenze/dist/firenze.min.js"></script>
// <script src="bower_components/firenze-adapter-memory/dist/firenze-adapter-memory.min.js"></script>
//
// <script>
// // Memory adapter is availble in `firenze.MemoryAdapter`
// var db = new firenze.Database({
//   adapter: firenze.MemoryAdapter
// });
// </script>
// ```
//
export default class Memory extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;
    this.data = {};
  }

  getConnection() {
    return this.data;
  }

  closeConnection(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    return cb();
  }

  dropTable(model) {
    this.data = _.omit(this.data, model.collection().table);
    return new P.resolve(true);
  }

  createTable(model) {
    this.data[model.collection().table] = [];
    return new P.resolve(true);
  }

  populateTable(model, rows) {
    this.data[model.collection().table] = rows;
    return new P.resolve(true);
  }

  query(collection, options = {}) {
    let opt = _.merge(options, {
      table: collection.table,
      alias: collection.model().alias,
      primaryKey: collection.model().primaryKey
    });

    let promise = new P((resolve, reject) => {
      return this
        .findRecords(opt)
        .then((results) => {
          return resolve(results);
        })
        .catch((error) => {
          return reject(error);
        });
    });

    return _.merge(promise, opt);
  }

  create(q, obj) {
    obj[q.primaryKey] = _.uniqueId();
    this.data[q.table].push(obj);
    return new P.resolve(obj);
  }

  read(q) {
    return new P.resolve(q);
  }

  findRecords(q) {
    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          // all
          let records = this.data[q.table];
          return cb(null, records);
        },
// ## Finders
//
// Examples below assumes you have an instance of Collection already:
//
// ```js
// var posts = new Posts();
// ```
//
// ### first
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
// ### all
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
// ### list
//
// Gives you a list of key/value paired object of matched results:
//
// ```js
// posts.find('list', {
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
// ### count
//
// Gives you the total count of matched results:
//
// ```js
// posts.find('count').then(function (count) {
//   // count is an integer here
// });
// ```
//
        (records, cb) => {
          // conditions
          if (!q.conditions) {
            return cb(null, records);
          }

          let conditions = {};
          _.each(q.conditions, (v, k) => {
            if (k.indexOf('.') > -1) {
              k = k.split('.')[1];
              conditions[k] = v;
            }
          });

          let filtered = _.filter(records, _.matches(conditions));
          return cb(null, filtered);
        },
// ## Order
//
// For ordering results:
//
// ```js
// posts.find('all', {
//   order: {
//     'Post.title': 'asc'
//   }
// });
// ```
//
        (records, cb) => {
          // sort
          if (!q.order) {
            return cb(null, records);
          }

          let order;
          if (_.isObject(q.order)) {
            order = [];
            _.each(q.order, (v, k) => {
              order.push({
                [k]: v
              });
            });
          } else {
            order = q.order;
          }

          let sortFields = [];
          let sortOrders = [];

          order.forEach((o) => {
            let k = _.keys(o)[0];
            let v = _.values(o)[0];

            if (k.indexOf('.') > -1) {
              k = k.split('.')[1];
            }

            sortFields.push(k);
            sortOrders.push(v.toLowerCase() === 'asc' ? true : false);
          });

          let sorted = _.sortByOrder(records, sortFields, sortOrders);
          return cb(null, sorted);
        },
// ## Limit (pagination)
//
// Limit number of results:
//
// ```js
// posts.find('all', {
//   limit: 10
// });
// ```
//
// If you want to go through paginated results:
//
// ```js
// posts.find('all', {
//   limit: 10,
//   page: 2
// });
// ```
//
        (records, cb) => {
          // limit
          let page = q.page ? q.page : 1;
          let limit = q.limit ? q.limit : null;

          if (!limit) {
            return cb(null, records);
          }

          let from = (page - 1) * limit;
          let to = from + limit;
          let limited = records.slice(from, to);
          return cb(null, limited);
        },
// ## Fields
//
// Select only a number of fields:
//
// ```js
// posts.find('all', {
//   fields: [
//     'id',
//     'title'
//   ]
// });
// ```
//
        (records, cb) => {
          // fields
          if (!_.isArray(q.fields)) {
            return cb(null, records);
          }

          return cb(null, _.map(records, (record) => {
            return _.pick(record, q.fields);
          }));
        },
        (records, cb) => {
          // count
          if (q.count) {
            return cb(null, [
              {
                '*': records.length
              }
            ]);
          }

          return cb(null, records);
        }
      ], (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  update(q, obj) {
    return new P((resolve, reject) => {
      return q.then((records) => {
        if (records.length === 0) {
          return reject(false);
        }

        let id = records[0][q.primaryKey];
        let k = _.findIndex(this.data[q.table], (r) => {
          return r[q.primaryKey] === id;
        });
        this.data[q.table][k] = _.merge(this.data[q.table][k], obj);
        return resolve(this.data[q.table][k]);
      });
    });
  }

  delete(q) {
    return new P((resolve, reject) => {
      return q.then((records) => {
        if (records.length === 0) {
          return reject(false);
        }

        let id = records[0][q.primaryKey];
        let k = _.findIndex(this.data[q.table], (r) => {
          return r[q.primaryKey] === id;
        });
        this.data[q.table].splice(k, 1);
        return resolve(1);
      });
    });
  }
}
