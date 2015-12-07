import _ from 'lodash';
import P from './Promise';

// # Behavior
//
// Behaviors allow you to hook into your Collections and Models and make them behave in a certain way. This allows for more re-usability in your code, since you can put common operations at Behavior level, and can then just assign the single Behavior to multiple Collections/Models.
//
// ## Usage
//
// ```js
// var Posts = db.createCollection({
//   behaviors: [
//     TimestampBehavior,
//     AnotherBehavior
//   ]
// });
// ```
//
// With custom configuration:
//
// ```js
// var Posts = db.createCollection({
//   behaviors: [
//     {
//       'class': TimestampBehavior,
//       options: {
//         timezone: 'UTC'
//       }
//     },
//     AnotherBehavior
//   ]
// });
// ```
//
// ## Creating classes
//
// ```js
// var f = require('firenze');
//
// var TimestampBehavior = f.createBehavior({
//   beforeSave: function (model) {
//     model.set('created', new Date());
//     return new f.Promise(true);
//   }
// });
// ```
//
// If you are using ES6, the syntax can be much simpler:
//
// ```js
// import {Behavior, Promise} from 'firenze';
//
// class TimestampBehavior extends Behavior {
//   beforeSave(model) {
//     model.set('created', new Date());
//     return new Promise(true);
//   }
// }
// ```
//

export default class Behavior {
  constructor(extend = {}) {
// ## Properties
//
// ### collection
//
// The current instance of collection
//
    this.collection = null;

// ### options
//
// Behavior configuration
//
    this.options = {};

    _.merge(this, extend);
  }

// ## Callback methods
//
// Behavior allows your to hook into your model's lifecycle callbacks.
//
// The following callbacks are supported:
//
// ### collectionInitialize(collection)
//
// Called right after collection's construction, synchronous operations only.
//
  collectionInitialize(collection) { //eslint-disable-line

  }

//
// ### modelInitialize(model)
//
// Called right after model's construction, synchronous operations only.
//
  modelInitialize(model) { //eslint-disable-line

  }

// ### beforeSave(model)
//
// Called before saving the model.
//
// Returns a promise.
//
  beforeSave(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterSave(model)
//
// Called after saving the model.
//
// Returns a promise.
//
  afterSave(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### beforeValidate(model)
//
// Called before validating a model.
//
// Returns a promise.
//
  beforeValidate(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterValidate(model)
//
// Called after validating a model.
//
// Returns a promise.
//
  afterValidate(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### beforeDelete(model)
//
// Called before deleting a model.
//
// Returns a promise.
//
  beforeDelete(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterDelete(model)
//
// Called after deleting a model.
//
// Returns a promise.
//
  afterDelete(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }
}
