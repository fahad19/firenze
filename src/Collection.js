import _ from 'lodash';
import P from 'bluebird';

// # Collection
//
// A collection represents a table. If you have a `posts` table, most likely you would have a collection for it called `Posts`.
//
// ## Creating classes
//
// You can create a Collection class from your Database instance. And it requires minimum two properies, `table`, and `modelClass`:
//
// ```js
// var Posts = db.createCollectionClass({
//   table: 'posts',
//
//   modelClass: function () {
//     return Post;
//   }
// });
// ```
//
// There is also a short method for creating Collection class via `db.Collection()`.
//
// You can also create a Collection class like this:
//
// ```js
// var Posts = f.createCollectionClass({
//   db: db, // instance of your Database
//
//   table: 'posts',
//
//   // ...
// });
// ```
//

export default class Collection {
  constructor(extend = {}) {

// ### Properties
//
// #### modelClass
//
// Every collection requires a Model for representing its records. This property can directly reference to the Model class, or it can be a function that returns the Model class.
//
    this.modelClass = null;

// #### table
//
// The name of the table that this Collection represents. Always as a string.
//
    this.table = null;

// #### finders
//
// List of mapped finder methods that you want available in `.find(mappedName, options)`
//
// By default these are set:
//
// ```js
// {
//   all: 'findAll',
//   first: 'findFirst',
//   count: 'findCount',
//   list: 'findList'
// }
// ```
//
// This mapping allows you to later call `.find('all', options)`, which eventually calls `.findAll(options)`.
//
    this.finders = {
      all: 'findAll',
      first: 'findFirst',
      count: 'findCount',
      list: 'findList'
    };

    _.merge(this, extend);
  }

// ## Usage
//
// Before using the Collection, you need to create an instance of it:
//
// ```js
// var posts = new Posts();
// ```
//

// ## Methods
//
// ### model(attributes = {}, extend = {})
//
// Get an instance of this Collection's model
//
  model(attributes = {}, extend = {}) {
    if (!this.modelClass) {
      return new Error('Cannot find any modelClass');
    }

    let isInstance = function (i) {
      return !_.isFunction(i) && _.isObject(i.schema);
    };

    let M = this.modelClass;

    M = new M(attributes, extend);
    if (isInstance(M)) {
      return M;
    }

    M = new M(attributes, extend);
    if (isInstance(M)) {
      return M;
    }

    return new M(attributes, extend);
  }

// ### getDatabase()
//
// Get in instance of the current Database
//
  getDatabase() {
    return this.db;
  }

// ### getAdapter()
//
// Get adapter of the Collections' database
//
  getAdapter() {
    return this.getDatabase().getAdapter();
  }

// ### setDatabase(db)
//
// Change database instance of this Collection to `db`
//
  setDatabase(db) {
    this.db = db;
  }

// ### query(options = {})
//
// Get query object for this Collection
//
  query(options = {}) {
    return this.getAdapter().query(this, options);
  }

// ### find(type, options = {})
//
// Explained above in `Finders` section
//
  find(type = null, options = {}) {
    if (!type || !this.finders[type] || !_.isFunction(this[this.finders[type]])) {
      throw new Error('Invalid find type');
    }

    return this[this.finders[type]](options);
  }

// ### findAll(options = {})
//
// Returns an array of matched models
//
  findAll(options = {}) {
    let q = this.query(options);

    return new P((resolve, reject) => {
      return this
        .getAdapter()
        .read(q)
        .then((results) => {
          let models = [];
          _.each(results, (v) => {
            models.push(this.model(v));
          });
          return resolve(models);
        })
        .catch(reject);
    });
  }

// ### findFirst(options = {})
//
// Returns matched model if any
//
  findFirst(options = {}) {
    let q = this.query(_.merge(options, {
      limit: 1
    }));

    return new P((resolve, reject) => {
      return this
        .getAdapter()
        .read(q)
        .then((results) => {
          if (results.length === 0) {
            return resolve(null);
          }

          return resolve(this.model(results[0]));
        })
        .catch(reject);
    });
  }

// ### findCount(options = {})
//
// Returns count of matched results
//
  findCount(options = {}) {
    let q = this.query(_.merge(options, {
      count: true
    }));

    return new P((resolve, reject) => {
      return this
        .getAdapter()
        .read(q)
        .then(function (results) {
          if (results.length === 0) {
            return resolve(null);
          }

          let firstKey = _.first(_.keys(results[0]));
          let count = results[0][firstKey];

          return resolve(count);
        })
        .catch(reject);
    });
  }

// ### findList(options = {})
//
// Returns key/value pair of matched results
//
  findList(options = {}) {
    let model = this.model();
    if (!_.isArray(options.fields)) {
      options.fields = [
        model.primaryKey,
        model.displayField
      ];
    }

    let q = this.query(options);

    return new P(function (resolve, reject) {
      return q.then(function (results) {
        let list = {};

        _.each(results, function (v) {
          let listK = v[model.primaryKey];
          let listV = v[model.displayField];
          list[listK] = listV;
        });

        return resolve(list);
      }).catch(reject);
    });
  }

// ### save(model, options = {})
//
// Save the given model. This method is not usually called directly, but rather via `Model.save()`.
//
  save(model, options = {}) {
    let obj = model.toObject();
    return new P((resolve, reject) => {
      let promise = null;
      let q = null;

      if (model.isNew()) {
        q = this.query({
          alias: false
        });
        promise = this.getAdapter().create(q, obj);
      } else {
        obj = _.omit(obj, model.primaryKey);
        if (_.isArray(options.fields)) {
          obj = _.pick(obj, options.fields);
        }

        q = this.query({
          alias: false,
          conditions: {
            [model.primaryKey]: model.getId()
          }
        });
        promise = this
          .getAdapter()
          .update(q, obj);
      }

      promise.then((ids) => {
        let id = null;
        if ((_.isArray(ids) && ids.length === 0) || !ids) {
          return resolve(id);
        } else if (_.isArray(ids)) {
          id = ids[0];
        } else {
          id = ids;
        }

        return this.model({id: id}).fetch().then(function (m) {
          resolve(m);
        }).catch(function (error) {
          reject(error);
        });
      }).catch(reject);
    });
  }

// ### delete(model)
//
// Deletes the given model. Usually called via `Model.delete()`.
//
  delete(model) {
    return new P((resolve, reject) => {
      if (model.isNew()) {
        let error = new Error('Cannot delete a model without ID');
        return reject(error);
      }

      let q = this.query({
        alias: false,
        conditions: {
          [model.primaryKey]: model.getId()
        }
      });

      return this
        .getAdapter()
        .delete(q)
        .then(resolve)
        .catch(reject);
    });
  }
}
