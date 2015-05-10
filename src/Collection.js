var _ = require('lodash');
var Promise = require('bluebird');

var query = require('./query');

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
// ### Properties
//
// #### table
//
// The name of the table that this Collection represents. Always as a string.
//
// #### modelClass
//
// Every collection requires a Model for representing its records. This property can directly reference to the Model class, or it can be a function that returns the Model class.
//
// ## Usage
//
// Before using the Collection, you need to create an instance of it:
//
// ```js
// var posts = new Posts();
// ```
//
// ### Finders
//
// There are various ways you can find results:
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

class Collection {
  constructor(extend = {}) {
    this.modelClass = null;
    this.table = null;
    this.alias = null;
    this.finders = {
      all: 'findAll',
      first: 'findFirst',
      count: 'findCount',
      list: 'findList'
    };
    _.merge(this, extend);
  }

// ### Methods
//
// #### model(attributes = {}, extend = {})
//
// Get an instance of this Collection's model
//
  model(attributes = {}, extend = {}) {
    if (!this.modelClass) {
      return new Error('Cannot find any modelClass');
    }

    var isInstance = function (i) {
      return !_.isFunction(i) && _.isObject(i.schema);
    };

    var M = this.modelClass;

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

// #### database()
//
// Get in instance of the current Database
//
  database() {
    return this.db;
  }

// #### setDatabase(db)
//
// Change database instance of this Collection to `db`
//
  setDatabase(db) {
    this.db = db;
  }

// #### getQuery(options = {})
//
// Get query object for this Collection
//
  getQuery(options = {}) {
    return query.get(this, options);
  }

// #### find()
//
// Explained above in `Finders` section
//
  find(type = 'first', options = {}) {
    if (!this.finders[type] || !_.isFunction(this[this.finders[type]])) {
      throw new Error('Invalid find type');
    }

    return this[this.finders[type]](options);
  }

  findAll(options = {}) {
    var q = this.getQuery(options);

    var self = this;
    return new Promise(function (resolve, reject) {
      return q.then(function (results) {
        var models = [];
        _.each(results, function (v) {
          models.push(self.model(v));
        });
        return resolve(models);
      }).catch(reject);
    });
  }

  findFirst(options = {}) {
    var q = this.getQuery(options);
    q.limit(1);

    var self = this;
    return new Promise(function (resolve, reject) {
      return q.then(function (results) {
        if (results.length === 0) {
          return resolve(null);
        }

        return resolve(self.model(results[0]));
      }).catch(reject);
    });
  }

  findCount(options = {}) {
    var q = this.getQuery(options);
    q.count();

    return new Promise(function (resolve, reject) {
      return q.then(function (results) {
        if (results.length === 0) {
          return resolve(null);
        }

        var firstKey = _.first(_.keys(results[0]));
        var count = results[0][firstKey];

        return resolve(count);
      }).catch(reject);
    });
  }

  findList(options = {}) {
    var model = this.model();
    if (!_.isArray(options.fields)) {
      options.fields = [
        model.primaryKey,
        model.displayField
      ];
    }

    var q = this.getQuery(options);

    return new Promise(function (resolve, reject) {
      return q.then(function (results) {
        var list = {};

        _.each(results, function (v) {
          var listK = v[model.primaryKey];
          var listV = v[model.displayField];
          list[listK] = listV;
        });

        return resolve(list);
      }).catch(reject);
    });
  }

// #### save(model, options = {})
//
// Save the given model. This method is not usually called directly, but rather via `Model.save()`.
//
  save(model, options = {}) {
    var obj = model.toObject();
    var q = this.getQuery({
      alias: false
    });
    var self = this;
    return new Promise(function (resolve, reject) {
      if (model.isNew()) {
        q.insert(obj);
      } else {
        obj = _.omit(obj, model.primaryKey);
        if (_.isArray(options.fields)) {
          obj = _.pick(obj, options.fields);
        }

        q
          .where(model.primaryKey, '=', model.getId())
          .update(obj);
      }

      q.then(function (ids) {
        var id = null;
        if ((_.isArray(ids) && ids.length === 0) || !ids) {
          return resolve(id);
        } else if (_.isArray(ids)) {
          id = ids[0];
        } else {
          id = ids;
        }

        return self.model({id: id}).fetch().then(function (m) {
          resolve(m);
        }).catch(function (error) {
          reject(error);
        });
      }).catch(reject);
    });
  }

// #### delete(model)
//
// Deletes the given model. Usually called via `Model.delete()`.
//
  delete(model) {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (model.isNew()) {
        var error = new Error('Cannot delete a model without ID');
        return reject(error);
      }

      var q = self.getQuery({
        alias: false
      });

      return q
        .where(model.primaryKey, '=', model.getId())
        .del()
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Collection;
