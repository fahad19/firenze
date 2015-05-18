import _ from 'lodash';
import P from 'bluebird';
import dotProp from 'dot-prop';
import validator from 'validator';
import async from 'async';
import getParams from 'get-params';

// # Models
//
// A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.
//

export default class Model {

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
// You can also create a Model class like this:
//
// ```js
// var Post = f.createModelClass({
//   // ...
// });
// ```
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

// #### validationRules
//
// Example:
//
// ```js
// {
//   ruleName: function (field, value) {
//     return true;
//   },
//   asyncRule: function (value, field, validated) {
//     return validated(true);
//   },
//   ruleWithOptions: function (value, field, arg1, arg2) {
//     return true;
//   }
// }
// ```
//
    this.validationRules = {};

    _.merge(this, extend);

// #### alias
//
// Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.
//
    if (!this.alias) {
      this.alias = this.collection().table;
    }

    let id = this.get(this.primaryKey);
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

// ## Validations
//
// Validation rules for fields can be set when defining the schema:
//
// ### Single rule
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
// But of course, you can always override them or add new custom rules.
//
// ### Custom rules
//
// Validation rules can be defined when creating a Model class:
//
// ```js
// var Post = db.createModelClass({
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
// var Post = db.createModelClass({
//   schema: {
//     name: {
//       type: 'string',
//       validate: {
//         rule: 'isAlpha',
//         require: true,
//         message: 'Must be alphabets only'
//       }
//     }
//   }
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

    let isInstance = function (i) {
      return !_.isFunction(i) && _.isString(i.table);
    };

    let C = this.collectionClass;

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
    let obj = this.toObject();
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

// ### toJSON()
//
// Alias of `.toObject()`.
//
  toJSON() {
    return this.toObject();
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
    let id = this.getId();
    if (!id) {
      throw new Error('No ID found');
    }

    let collection = this.collection();
    _.merge(options, {
      conditions: {
        [this.alias + '.' + this.primaryKey]: id
      }
    });
    return new P(function (resolve, reject) {
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
    let id = this.id || this.get(this.primaryKey);
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
    if (!_.isUndefined(options.validate) || options.validate === false) {
      return this.collection().save(this, options);
    }

    return new P((resolve, reject) => {
      this.validate().then((validated) => {
        if (validated === true) {
          return resolve(this.collection().save(this, options));
        }

        return reject({
          validationErrors: validated
        });
      });
    });
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

// ### validate()
//
// Validates all fields of the current Model
//
// Returns true if all validated, otherwise an object of error messages keyed by field names.
//
  validate() {
    let fields = [];
    _.each(this.toObject(), (v, field) => {
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
          .validateField(field)
          .then((validated) => {
            if (validated !== true) {
              list[field] = validated;
            }

            cb();
          });
      }, (err, results) => {
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

// ### validateField(field, value = null)
//
// Validates a single field
//
// Returns true if validated, otherwise error message
//
  validateField(field, value = null) {
    if (!value) {
      value = this.get(field);
    }

    let fieldSchema = this.schema[field];
    if (!_.isObject(fieldSchema) || !fieldSchema.validate) {
      return new P.resolve(true);
    }

    let validate = fieldSchema.validate;
    if (!_.isArray(validate)) {
      validate = [validate];
    }

    return new P((resolve, reject) => {
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
            this,
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

// ### fixturify(rows)
//
// Drop, create, and populate table with data
//
  fixturify(rows) {
    return this.collection().getAdapter().loadFixture(this, rows);
  }
}
