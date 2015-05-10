var _ = require('lodash');
var Promise = require('bluebird');
var dotProp = require('dot-prop');

// # Models
//
// A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.
//
// ## Creating classes
//
// You can create a Model class from your Database instance. And it can be created as follows:
//
// ```js
// var Post = db.createModelClas({
//   alias: 'Post',
//
//   displayField: 'title',
//
//   schema: {
//     id: {
//       type: 'increments'
//     },
//     title: {
//       type: 'string'
//     }
//   },
//
//   collectionClass: Posts
// });
// ```
//
// There is a short method for creating a Model class via `db.Model()`.
//
// ### Properties
//
// #### alias
//
// Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.
//
// #### displayField
//
// This is the field that represents your record's display value. Usually `title` or `name` in most cases.
//
// #### collectionClass
//
// Just like how Collection has a modelClass, models also need to have a collectionClass. It can be a direct reference to the class, or it can be a function that returns the class.
//
// #### schema
//
// Models do not necessarily need to define their full schema, but you would need them for building fixtures and also assigning validation rules for example later.
//
// The keys of this object are the column names, and the value defines what type of column they are. For example:
//
// ```js
// {
//   id: {
//     type: 'increments'
//   },
//   title {
//     type: 'string'
//   }
// }
// ```
//
// List of available column types:
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
// ## Usage
//
// Unless otherwise you are already provided with a model instance from a Collection, you need to create an instance of it:
//
// ```js
// var post = new Post();
// ```
//
// You can also create an instance of a Model with some data:
//
// ```js
// var post = new Post({
//   title: 'Hello World',
//   body: 'blah...'
// });
// ```

class Model {
  constructor(attributes = {}, extend = {}) {
    this.collectionClass = null;
    this.schema = {};
    this.attributes = attributes ? attributes : {};
    this.primaryKey = 'id';
    this.displayField = null;
    this.id = null;
    _.merge(this, extend);

    var id = this.get(this.primaryKey);
    if (id) {
      this.id = id;
    }
  }

  collection(options = {}) {
    if (!this.collectionClass) {
      return new Error('Cannot find any collectionClass');
    }

    var isInstance = function (i) {
      return !_.isFunction(i) && _.isString(i.table);
    };

    var C = this.collectionClass;

    C = new C(options);
    if (isInstance(C)) {
      return C;
    }

    C = new C(options);
    if (isInstance(C)) {
      return C;
    }

    return new C(options);
  }

  get(field) {
    var obj = this.toObject();
    return dotProp.get(obj, field);
  }

  set(field, value) {
    if (_.isObject(field)) {
      return _.merge(this.attributes, field);
    }

    this.attributes[field] = value;
  }

  toObject() {
    return this.attributes;
  }

  fetch(options = {}) {
    var id = this.getId();
    if (!id) {
      throw new Error('No ID found');
    }

    var collection = this.collection();
    _.merge(options, {
      conditions: {
        [this.alias + '.' + this.primaryKey]: id
      }
    });
    return new Promise(function (resolve, reject) {
      return collection.find('first', options).then(function (model) {
        resolve(model);
      }).catch(reject);
    });
  }

  getId() {
    var id = this.id || this.get(this.primaryKey);
    if (!_.isUndefined(id)) {
      return id;
    }

    return null;
  }

  isNew() {
    return this.getId() ? false : true;
  }

  save(options = {}) {
    return this.collection().save(this, options);
  }

  saveField(field, value) {
    this.set(field, value);
    return this.save({
      fields: [field]
    });
  }

  clear() {
    this.id = null;
    this.attributes = {};
  }

  delete() {
    return this.collection().delete(this);
  }
}

module.exports = Model;
