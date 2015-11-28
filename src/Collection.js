/* eslint-disable new-cap, no-shadow */

import _ from 'lodash';
import async from 'async';
import validator from 'validator';
import getParams from 'get-params';
import P from './Promise';
import Model from './Model';

// # Collection
//
// A collection represents a table. If you have a `posts` table, most likely you would have a collection for it called `Posts`.
//
// ## Creating classes
//
// You can create a Collection class from your Database instance. And it requires minimum one property: `table`:
//
// ```js
// var Posts = db.createCollectionClass({
//   table: 'posts',
//
//   // optional
//   modelClass: Post
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
//   table: 'posts'
// });
// ```
//
// If you are using ES6:
//
// ```js
// import {Collection} from 'firenze';
//
// class Posts extends Collection {
//   constructor(extend = {}) {
//     super(extend);
//     this.setDatabase(db);
//   }
// }
// ```
//

export default class Collection {
  constructor(extend = {}) {

// ### Properties
//
// #### modelClass
//
// Every collection requires a Model for representing its records. This property directly references to the Model class.
//
// Be defalult, it is set to the base Model class, which you can always override.
//
    this.modelClass = Model;

// #### table
//
// The name of the table that this Collection represents. Always as a string.
//
    this.table = null;

// #### schema
//
// Collections do not necessarily need to define their full schema, but you would need them for building fixtures and also assigning validation rules for example later.
//
// The keys of this object are the column names, and the value defines what type of column they are. For example:
//
// ```js
// {
//   id: {
//     type: 'integer'
//   },
//   title: {
//     type: 'string'
//   }
// }
// ```
//
// Column types can vary depending on the adapter you are using.
//
// You also use the `schema` property to set validation rules.
//
// For example:
//
// ```js
// {
//   email: {
//     type: 'string',
//     validate: {
//       rule: 'isEmail',
//       message: 'Please enter a valid email address'
//     }
//   }
// }
// ```
//
// Validations will be discussed further later in its own section.
//
    this.schema = {};

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

// #### validationRules
//
// Define rules logic which can be used for various fields.
//
// Example:
//
// ```js
// {
//   ruleName: function (field, value) {
//     return true;
//   },
//   asyncRule: function (value, field, done) {
//     return done(true);
//   },
//   ruleWithOptions: function (value, field, arg1, arg2) {
//     return true;
//   }
// }
// ```
//
    this.validationRules = {};

// #### behaviors
//
// Array of behavior classes, in the order as you want them applied.
//
// Example:
//
// ```js
// [
//   TimestampBehavior,
//   AnotherCustomBehavior
// ]
// ```
//
    this.behaviors = [];

// #### loadedBehaviors
//
// Array of already loaded behaviors for this model
//
    this.loadedBehaviors = [];

    _.merge(this, extend);

// #### alias
//
// Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.
//
    if (!this.alias) {
      this.alias = this.table;
    }

    this.loadBehaviors();
    this.callBehavedMethod(this, 'collectionInitialize');
  }

// ## Usage
//
// Before using the Collection, you need to create an instance of it:
//
// ```js
// var posts = new Posts();
// ```
//

// ## Validations
//
// Validation rules for fields can be set when defining the schema:
//
// ### Single rule
//
// ```js
// db.createCollectionClass({
//   schema: {
//     email: {
//       type: 'string',
//       validate: {
//         rule: 'isEmail',
//         message: 'Please enter a valid email address'
//       }
//     }
//   }
// });
// ```
//
// ### Multiple rules
//
// ```js
// {
//   email: {
//     type: 'string',
//     validate: [
//       {
//         rule: 'isLowercase',
//         message: 'Please enter email address in lowercase',
//       },
//       {
//         rule: 'isEmail',
//         message: 'Please enter a valid email address'
//       }
//     ]
//   }
// }
// ```
//
// ### Rule with options
//
// ```js
// {
//   fruit: {
//     type: 'string',
//     validate: {
//       rule: [
//        'isIn', // `isIn` is the rule name
//        [
//          'apple',
//          'banana'
//        ] // this array is passed as an argument to rule function
//       ],
//       message: 'Must be either apple or banana'
//     }
//   }
// }
// ```
//
// ### Rule as a function
//
// ```js
// {
//   mood: {
//     type: 'string',
//     validate: {
//       rule: function (field, value) {
//         return true;
//       }
//     }
//   }
// }
// ```
//
// ### Asynchronouse rule
//
// ```js
// {
//   food: {
//     type: 'string',
//     validate: {
//       rule: function (field, value, done) {
//         checkIfFoodIsHealthy(value, function (healthy) {
//           var isHealthy = healthy === true;
//           done(isHealthy);
//         });
//       }
//     }
//   }
// }
// ```
//
// ### Available rules
//
// By default, all the validation rules from [Validator.js](https://github.com/chriso/validator.js#validators) is available:
//
// - **equals(str, comparison)** - check if the string matches the comparison.
// - **contains(str, seed)** - check if the string contains the seed.
// - **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
// - **isEmail(str [, options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part.
// - **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
// - **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
// - **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
// - **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
// - **isNumeric(str)** - check if the string contains only numbers.
// - **isAlphanumeric(str)** - check if the string contains only letters and numbers.
// - **isBase64(str)** - check if a string is base64 encoded.
// - **isHexadecimal(str)** - check if the string is a hexadecimal number.
// - **isHexColor(str)** - check if the string is a hexadecimal color.
// - **isLowercase(str)** - check if the string is lowercase.
// - **isUppercase(str)** - check if the string is uppercase.
// - **isInt(str [, options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`).
// - **isFloat(str [, options])** - check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`).
// - **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
// - **isNull(str)** - check if the string is null.
// - **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
// - **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
// - **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
// - **isDate(str)** - check if the string is a date.
// - **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
// - **isBefore(str [, date])** - check if the string is a date that's before the specified date.
// - **isIn(str, values)** - check if the string is in a array of allowed values.
// - **isCreditCard(str)** - check if the string is a credit card.
// - **isISIN(str)** - check if the string is an [ISIN][ISIN] (stock/security identifier).
// - **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
// - **isMobilePhone(str, locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM']`).
// - **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
// - **isMultibyte(str)** - check if the string contains one or more multibyte chars.
// - **isAscii(str)** - check if the string contains ASCII chars only.
// - **isFullWidth(str)** - check if the string contains any full-width chars.
// - **isHalfWidth(str)** - check if the string contains any half-width chars.
// - **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
// - **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
// - **isMongoId(str)** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
// - **isCurrency(str, options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.
//
// Example usage of the above mentioned rules:
//
// ```js
// db.createCollectionClass({
//   schema: {
//     title: {
//       // direct rule
//       validate: {
//         rule: 'isAlphanumeric'
//       }
//     },
//     body: {
//       // rule with options
//       validate: {
//         rule: ['isLength', min, max]
//       }
//     }
//   }
// });
// ```
//
// But of course, you can always override them or add new custom rules.
//
// ### Custom rules
//
// Validation rules can be defined when creating a Collection class:
//
// ```js
// var Posts = db.createCollectionClass({
//   schema: {
//     name: {
//       type: 'string',
//       validate: {
//         rule: 'myFirstRule'
//       }
//     },
//     title: {
//       type: 'string',
//       validate: {
//         rule: [
//           'myRuleWithOptions',
//           'arg1 value',
//           'arg2 value'
//         ]
//       }
//     }
//   },
//
//   validationRules: {
//     myFirstRule: function (field, value) {
//       return true; // validated successfully
//     },
//     myRuleWithOptions: function (field, value, arg1, arg2) {
//       return true;
//     },
//     myAsyncRule: function (field, value, done) {
//       doSomething(value, function (result) {
//         var validated = result === true;
//         done(validated);
//       });
//     }
//   }
// });
// ```
//
// ### Required fields
//
// By default, validation rules are only checked against fields that are set.
//
// But if you wish to make sure that certain fields are required, meaning they should always be present, you can mark them as required in your schema:
//
// ```js
// var Posts = db.createCollectionClass({
//   schema: {
//     name: {
//       type: 'string',
//       validate: {
//         rule: 'isAlpha',
//         required: true,
//         message: 'Must be alphabets only'
//       }
//     }
//   }
// });
// ```
//

// ## Methods
//
// ### model(attributes = {}, extend = {})
//
// Get an instance of this Collection's model
//
  model(attributes = {}, extend = {}) {
    _.merge(extend, {
      collection: this
    });

    return new this.modelClass(attributes, extend);
  }

// ### getDatabase()
//
// Get an instance of the current Database
//
  getDatabase() {
    return this.db;
  }

// ### setDatabase(db)
//
// Change database instance of this Collection to `db`
//
  setDatabase(db) {
    this.db = db;
  }

// ### getAdapter()
//
// Get adapter of the Collection's database
//
  getAdapter() {
    return this.getDatabase().getAdapter();
  }

// ### query()
//
// Get a new query builder for this Collection's table
//
  query() {
    return this.getAdapter.query().table(this.table);
  }

// ### find()
//
// Returns query builder for fetching records of this Collection
//
  find() {
    return this.query().from(this.table, this.alias);
  }

// ### findBy(field, value)
//
// Shortcut method for finding single record that matches a field's value.
//
// Returns a promise.
//
  findBy(field, value) {
    return this.find()
      .where({
        [field]: value
      })
      .first();
  }

// ### findAllBy(field, value)
//
// Shortcut method for finding all records that matche a field's value.
//
// Returns a promise.
//
  findAllBy(field, value) {
    return this.find()
      .where({
        [field]: value
      })
      .all();
  }

// ### findById(value)
//
// Shortcut method for finding a record by its ID.
//
// Returns a promise.
//
  findById(value) {
    return this.findBy(this.primaryKey, value);
  }

// ### findByKey(value)
//
// Alias for `collection.findById()`.
//
// Returns a promise.
//
  findByKey(value) {
    return this.findById(value);
  }

// ### validate()
//
// Validates all fields of the given Model
//
// Returns a promise with `true` if all validated, otherwise an object of error messages keyed by field names.
//
// @TODO: `reject()` instead on error?
//
// Options:
//
// * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
//
  validate(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks) ? true : false;

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeValidate')
            .then((proceed) => {
              return cb(null, proceed);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (proceed, cb) => {
          return this //eslint-disable-line
            ._validate(model)
            .then((res) => {
              if (res === true) {
                return cb(null, true);
              }

              return cb(res);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (res, cb) => {
          if (!callbacks) {
            return cb(null, res);
          }

          return this
            .callBehavedMethod(model, 'afterValidate')
            .then(() => {
              return cb(null, res);
            })
            .catch((error) => {
              return cb(error);
            });
        }
      ], (err, result) => {
        if (err) {
          if (_.isObject(err)) {
            return resolve(err);
          }

          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _validate(model) { //eslint-disable-line
    let fields = [];
    _.each(model.toObject(), (v, field) => {
      if (!_.isObject(v)) {
        fields.push(field);
      }
    });

    _.each(this.schema, (schema, field) => {
      if (_.isUndefined(schema.validate)) {
        return;
      }

      if (_.isObject(schema.validate) && schema.validate.required) {
        fields.push(field);
        return;
      }

      if (!_.isArray(schema.validate)) {
        return;
      }

      _.each(schema.validate, (ruleObj) => {
        if (ruleObj.required) {
          fields.push(field);
        }
      });
    });

    fields = _.uniq(fields);
    let list = {};

    return new P((resolve, reject) => {
      async.mapSeries(fields, (field, cb) => {
        this
          .validateField(model, field)
          .then((validated) => {
            if (validated !== true) {
              list[field] = validated;
            }

            cb();
          })
          .catch((error) => {
            cb(error);
          });
      }, (err) => {
        if (err) {
          return reject(err);
        }

        if (_.isEmpty(list)) {
          return resolve(true);
        }

        return resolve(list);
      });
    });
  }

// ### validateField(model, field, value = null)
//
// Validates a single field
//
// Returns a promise with true if validated, otherwise error message
//
  validateField(model, field, value = null) {
    if (!value) {
      value = model.get(field);
    }

    let fieldSchema = this.schema[field];
    if (!_.isObject(fieldSchema) || !fieldSchema.validate) {
      return new P.resolve(true); //eslint-disable-line
    }

    let validate = fieldSchema.validate;
    if (!_.isArray(validate)) {
      validate = [validate];
    }

    return new P((resolve) => {
      async.eachSeries(validate, (ruleObj, cb) => {
        let rule = ruleObj.rule;
        let ruleName;
        let ruleOptions = [];
        let message = ruleObj.message;

        let validatorFunc;
        let validatorOptions;

        if (_.isString(rule)) {
          ruleName = rule;
        } else if (_.isArray(rule)) {
          ruleName = _.first(rule);
          ruleOptions = _.rest(rule);
        }

        if (_.isFunction(rule)) {
          // rule is a direct function
          validatorFunc = rule;
          validatorOptions = [field, value];
        } else if (ruleName && _.isFunction(this.validationRules[ruleName])) {
          // rule is an pre-defined function
          validatorFunc = this.validationRules[ruleName];
          validatorOptions = [field, value];
        } else if (_.isFunction(validator[ruleName])) {
          // validator.js
          validatorFunc = validator[ruleName];
          validatorOptions = [value].concat(ruleOptions);
        } else {
          // no rule found
          return cb(message);
        }

        let params = getParams(validatorFunc);
        if (_.last(params) === 'done') {
          // async
          validatorOptions.push(function (passed) {
            if (!passed) {
              return cb(message);
            }

            cb();
          });
        } else {
          // sync
          let passed = validatorFunc.apply(
            model,
            validatorOptions
          );

          if (!passed) {
            return cb(message);
          }

          cb();
        }
      }, (err) => {
        if (err) {
          return resolve(err);
        }

        return resolve(true);
      });
    });
  }

// ### save(model, options = {})
//
// Save the given model. This method is not usually called directly, but rather via `Model.save()`.
//
// Returns a promise with model instance.
//
// Options:
//
// * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
//
  save(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks) ? true : false;

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeSave')
            .then((proceed) => {
              if (proceed === true) {
                return cb(null, proceed);
              }

              return cb(proceed);
            });
        },
        (proceed, cb) => {
          if (!_.isUndefined(options.validate) && options.validate === false) {
            return this //eslint-disable-line
              ._save(model, options)
              .then(function (model) {
                return cb(null, model);
              })
              .catch(function (error) {
                return cb(error);
              });
          }

          return this.validate(model).then((validated) => {
            if (validated === true) {
              return this //eslint-disable-line
                ._save(model, options)
                .then(function (model) {
                  return cb(null, model);
                })
                .catch(function (error) {
                  return cb(error);
                });
            }

            return cb({
              validationErrors: validated
            });
          });
        },
        (result, cb) => {
          if (!callbacks) {
            return cb(null, model);
          }

          return this
            .callBehavedMethod(model, 'afterSave')
            .then(() => {
              return cb(null, model);
            });
        }
      ], function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _save(model, options = {}) {
    let obj = model.toObject();
    return new P((resolve, reject) => {
      let promise = null;
      let q = null;

      if (model.isNew()) {
        promise = this.query()
          .create(obj);
      } else {
        obj = _.omit(obj, model.primaryKey);
        if (_.isArray(options.fields)) {
          obj = _.pick(obj, options.fields);
        }

        promise = this.query()
          .where({
            [this.primaryKey]: model.getId()
          })
          .update(obj);
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

// ### delete(model, options = {})
//
// Deletes the given model. Usually called via `Model.delete()`.
//
// Returns a promise.
//
// Options:
//
// * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
//
  delete(model, options = {}) {
    let callbacks = (_.isUndefined(options.callbacks) || options.callbacks) ? true : false;

    return new P((resolve, reject) => {
      return async.waterfall([
        (cb) => {
          if (!callbacks) {
            return cb(null, true);
          }

          return this
            .callBehavedMethod(model, 'beforeDelete')
            .then((proceed) => {
              return cb(null, proceed);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (proceed, cb) => {
          return this //eslint-disable-line
            ._delete(model, this)
            .then((res) => {
              return cb(null, res);
            })
            .catch((error) => {
              return cb(error);
            });
        },
        (result, cb) => {
          return this
            .callBehavedMethod(model, 'afterDelete')
            .then(() => {
              return cb(null, result);
            })
            .catch((error) => {
              return cb(error);
            });
        }
      ], (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }

  _delete(model) {
    return new P((resolve, reject) => {
      if (model.isNew()) {
        let error = new Error('Cannot delete a model without ID');
        return reject(error);
      }

      this.query()
        .delete()
        .where({
          [this.primaryKey]: model.getId()
        })
        .run()
        .then(resolve)
        .catch(reject);
    });
  }

// ### loadBehaviors()
//
// Called during construction, and loads behaviors as defined in `behaviors` property.
//
  loadBehaviors() {
    this.behaviors.forEach((behaviorItem) => {
      let behaviorClass = behaviorItem;
      let behaviorOptions = {};

      if (_.isObject(behaviorItem) && _.isObject(behaviorItem.options)) {
        behaviorClass = behaviorItem.class;
        behaviorOptions = behaviorItem.options;
      }

      let behavior = new behaviorClass({
        collection: this,
        options: behaviorOptions
      });
      this.loadedBehaviors.push(behavior);
    });
  }

// ### callBehavedMethod(methodName)
//
// Used internally to call a callback method along with all the methods defined by loaded Behaviors too.
//
  callBehavedMethod(context, methodName) {
    if (methodName.indexOf('after') === -1 && methodName.indexOf('before') === -1) {
      // sync
      this.loadedBehaviors.forEach((behavior) => {
        behavior[methodName](context);
      });

      return true;
    }

    // async
    return new P((resolve, reject) => {
      return async.eachSeries(this.loadedBehaviors, (behavior, callback) => {
        behavior[methodName](context)
          .then((res) => {
            return callback(null, res);
          })
          .catch((error) => {
            return callback(error);
          });
      }, (error) => {
        if (error) {
          return reject(error);
        }

        return this[methodName](context)
          .then((res) => {
            return resolve(res);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    });
  }

// ## Callbacks
//
// Collections support callbacks that you can define when creating classes.
//
// For example:
//
// ```js
// var Promise = f.Promise;
// var Posts = f.createCollectionClass({
//   alias: 'Post',
//
//   beforeSave: function (model) {
//     // do something before saving...
//
//     // end the callback with a promise
//     return new Promise.resolve(true);
//   }
// });
// ```
//

// ### modelInitialize(model)
//
// Called right after Collection's Model construction.
//
// For synchronous operations only, since it does not return any Promise.
//
  modelInitialize(model) { //eslint-disable-line
    return true;
  }

// ### beforeSave(model)
//
// Should return a Promise with `true` to continue.
//
// To stop the save, return a Promise with an error.
//
  beforeSave(model) { //eslint-disable-line
    return new P.resolve(true);
  }

// ### afterSave(model)
//
// Should return a Promise.
//
  afterSave(model) { //eslint-disable-line
    return new P.resolve(true);
  }

// ### beforeValidate(model)
//
// Should return a Promise with `true` to continue.
//
// To stop the validation, return a Promise with an error.
//
  beforeValidate(model) { //eslint-disable-line
    return new P.resolve(true);
  }

// ### afterValidate(model)
//
// Should return a Promise.
//
  afterValidate(model) { //eslint-disable-line
    return new P.resolve(true);
  }

// ### beforeDelete(model)
//
// Should return a Promise with `true` to continue.
//
// To stop from deleting, return a Promise with an error.
//
  beforeDelete(model) { //eslint-disable-line
    return new P.resolve(true);
  }

// ### afterDelete(model)
//
// Should return a Promise.
//
  afterDelete(model) { //eslint-disable-line
    return new P.resolve(true);
  }
}
