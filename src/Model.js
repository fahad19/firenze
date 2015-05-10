var _ = require('lodash');
var Promise = require('bluebird');
var dotProp = require('dot-prop');

// # Models
//
// A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.
//

class Model {

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

  constructor(attributes = {}, extend = {}) {
// ### Properties
//
// #### collectionClass
//
// Just like how Collection has a modelClass, models also need to have a collectionClass. It can be a direct reference to the class, or it can be a function that returns the class.
//
    this.collectionClass = null;

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
    this.schema = {};

// #### attributes
//
// Your model's data
//
    this.attributes = attributes ? attributes : {};

// #### primaryKey
//
// The name of the ID field, defaults to `id`.
//
    this.primaryKey = 'id';

// #### displayField
//
// This is the field that represents your record's display value. Usually `title` or `name` in most cases.
//
    this.displayField = null;

// #### id
//
// For convenience, stores the ID of the model in this property
//
    this.id = null;

    _.merge(this, extend);

// #### alias
//
// Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.
//
    if (!this.alias) {
      this.alias = this.collection().table;
    }

    var id = this.get(this.primaryKey);
    if (id) {
      this.id = id;
    }
  }

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
//

// ## Methods
//
// ### collection(options = {})
//
// Get the model's Collection's instance
//

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

// ### get(field)
//
// Get the field of current model
//
  get(field) {
    var obj = this.toObject();
    return dotProp.get(obj, field);
  }

// ### set(field, value)
//
// Set an attribute with given value for the field
//
  set(field, value) {
    if (_.isObject(field)) {
      return _.merge(this.attributes, field);
    }

    this.attributes[field] = value;
  }

// ### toObject()
//
// Returns a plain object of the model
//
  toObject() {
    return this.attributes;
  }

// ### fetch(options = {})
//
// Fetches the model again from the Database.
//
// A quick example:
//
// ```js
// var post = new Post({id: 1});
// post.fetch().then(function (model) {
//   var title = model.get('title');
// });
// ```
//
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

// ### getId()
//
// Get the ID of model
//
  getId() {
    var id = this.id || this.get(this.primaryKey);
    if (!_.isUndefined(id)) {
      return id;
    }

    return null;
  }

// ### isNew()
//
// Is the current model new? As in saved in Database, or yet to be saved?
//
  isNew() {
    return this.getId() ? false : true;
  }

// ### save(options = {})
//
// Save the current model
//
  save(options = {}) {
    return this.collection().save(this, options);
  }

// ### saveField(field, value)
//
// Save a particular field with value
//
  saveField(field, value) {
    this.set(field, value);
    return this.save({
      fields: [field]
    });
  }

// ### clear()
//
// Clear the current instance of model of any data
//
  clear() {
    this.id = null;
    this.attributes = {};
  }

// ### delete()
//
// Delete the current model
//
  delete() {
    return this.collection().delete(this);
  }
}

module.exports = Model;
