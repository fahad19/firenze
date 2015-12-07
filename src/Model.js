/* eslint-disable new-cap */

import _ from 'lodash';
import P from './Promise';

// # Models
//
// A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular form, which is `Post`.
//

export default class Model {

// ## Creating classes
//
// You can create a Model class as follows:
//
// ```js
// var Post = f.createModel({
//   // ...
// });
// ```
//
// If you are using ES6:
//
// ```js
// import {Model} from 'firenze';
//
// class Post extends Model {
//   // ...
// }
// ```
//
  constructor(attributes = {}, extend = {}) {
// ### Properties
//
// #### attributes
//
// Your model's data
//
    this.attributes = attributes ? attributes : {};

// #### collection
//
// Reference to the instantiated Collection
//

// #### id
//
// For convenience, stores the ID of the model in this property
//
    this.id = null;

    _.merge(this, extend);

    let id = this.get(this.collection.primaryKey);
    if (id) {
      this.id = id;
    }

    this.collection.callBehavedMethod(this, 'modelInitialize');
  }

// ## Usage
//
// Ideally, you would be create a new Model instance via Collection:
//
// ```js
// var posts = new Posts();
// var post = posts.model({
//   title: 'Hello World'
// });
// ```
//

// ## Methods
//
// ### get(field)
//
// Get the field of current model
//
  get(field) {
    let obj = this.toObject();
    return _.get(obj, field);
  }

// ### set(field, value)
//
// Set an attribute with given value for the field
//
  set(field, value) {
    if (_.isObject(field)) {
      return _.merge(this.attributes, field);
    }

    return _.set(this.attributes, field, value);
  }

// ### toObject()
//
// Returns a plain object of the model
//
  toObject() {
    return this.attributes;
  }

// ### toJSON()
//
// Alias of `.toObject()`.
//
  toJSON() {
    return this.toObject();
  }

// ### fetch(options = {})
//
// Fetches the model from the Database, and returns it with a promise.
//
// A quick example:
//
// ```js
// var post = posts.model({id: 1});
//
// post.fetch().then(function (model) {
//   var title = model.get('title');
// });
// ```
//
// Returns a promise.
//
  fetch() {
    let id = this.getId();
    if (!id) {
      throw new Error('No ID found');
    }

    return new P((resolve, reject) => {
      return this.collection.findById(id)
        .then(function (model) {
          resolve(model);
        }).catch(reject);
    });
  }

// ### getId()
//
// Get the ID of model
//
  getId() {
    let id = this.id || this.get(this.collection.primaryKey);
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
    return this.getId() ? false : true; // eslint-disable-line
  }

// ### save(options = {})
//
// Save the current model, and returns a promise.
//
// Calls `Collection.save()`.
//
// Returns a promise.
//
  save(options = {}) {
    return this.collection.save(this, options);
  }

// ### saveField(field, value)
//
// Save a particular field with value.
//
// Returns a promise.
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

// ### delete(options = {})
//
// Delete the current model, and return a promise.
//
// Calls `Collection.delete()`
//
  delete(options = {}) {
    return this.collection.delete(this, options);
  }

// ### validate()
//
// Validates all fields of the current Model
//
// Calls `Collection.validate()`
//
  validate(options = {}) {
    return this.collection.validate(this, options);
  }

// ### validateField(field, value = null)
//
// Validates a single field
//
// Calls `Collection.validateField()`
//
// Returns a promise
//
  validateField(field, value = null) {
    return this.collection.validateField(this, field, value);
  }
}
