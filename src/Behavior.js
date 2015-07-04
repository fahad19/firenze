import _ from 'lodash';
import async from 'async';
import P from './Promise';

// # Behavior
//
// Behaviors allow you to hook into your Models and make them behave in a certain way. This allows for more re-usability in your code, since you can put common operations at Behavior level, and can then just assign the single Behavior to multiple Models.
//
// ## Usage
//
// ```js
// var Post = db.createModelClass({
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
// var Post = db.createModelClass({
//   behaviors: [
//     {
//       behavior: TimestampBehavior,
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
// var TimestampBehavior = f.createBehaviorClass({
//   beforeSave: function () {
//     this.model.set('created', new Date());
//     return new f.Promise(true);
//   }
// });
// ```
//
// If you are using ES6, the syntax is much simpler:
//
// ```js
// import f from 'firenze';
//
// class TimestampBehavior extends f.Behavior {
//   beforeSave() {
//     this.model.set('created', new Date());
//     return new f.Promise(true);
//   }
// }
// ```
//

export default class Behavior {
  constructor(extend = {}) {
// ## Properties
//
// ### model
//
// The current instance of model
//
    this.model = null;

// ### options
//
// Behavior configuration
//
    this.options = {};

    _.merge(this, extend);

// ### name
//
// Optionally give your behavior a unique name, which would allow you to later enable/disable them.
//
    this.name = 'CustomBehavior';
  }

// ## Callback methods
//
// Behavior allows your to hook into your model's lifecycle callbacks.
//
// The following callbacks are supported:
//
// ### initialize()
//
// Called right after model's construction, synchronous operations only.
//
  initialize() {

  }

// ### beforeSave()
//
// Called before saving the model.
//
// Returns a promise.
//
  beforeSave() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterSave()
//
// Called after saving the model.
//
// Returns a promise.
//
  afterSave() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### beforeValidate()
//
// Called before validating a model.
//
// Returns a promise.
//
  beforeValidate() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterValidate()
//
// Called after validating a model.
//
// Returns a promise.
//
  afterValidate() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### beforeDelete()
//
// Called before deleting a model.
//
// Returns a promise.
//
  beforeDelete() {
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### afterDelete()
//
// Called after deleting a model.
//
// Returns a promise.
//
  afterDelete() {
    return new P(function (resolve) {
      return resolve();
    });
  }
}
