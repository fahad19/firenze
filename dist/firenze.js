this["firenze"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Database = __webpack_require__(1);

	var _Database2 = _interopRequireDefault(_Database);

	var _Adapter = __webpack_require__(12);

	var _Adapter2 = _interopRequireDefault(_Adapter);

	var _Collection = __webpack_require__(11);

	var _Collection2 = _interopRequireDefault(_Collection);

	var _Model = __webpack_require__(4);

	var _Model2 = _interopRequireDefault(_Model);

	var _Promise = __webpack_require__(5);

	var _Promise2 = _interopRequireDefault(_Promise);

	var _commonCollectionFactory = __webpack_require__(10);

	var _commonCollectionFactory2 = _interopRequireDefault(_commonCollectionFactory);

	var _commonModelFactory = __webpack_require__(3);

	var _commonModelFactory2 = _interopRequireDefault(_commonModelFactory);

	exports['default'] = {
	  Database: _Database2['default'],
	  Adapter: _Adapter2['default'],
	  Collection: _Collection2['default'],
	  Model: _Model2['default'],

	  Promise: _Promise2['default'],

	  createCollectionClass: (0, _commonCollectionFactory2['default'])(),
	  createModelClass: (0, _commonModelFactory2['default'])()
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _commonModelFactory = __webpack_require__(3);

	var _commonModelFactory2 = _interopRequireDefault(_commonModelFactory);

	var _commonCollectionFactory = __webpack_require__(10);

	var _commonCollectionFactory2 = _interopRequireDefault(_commonCollectionFactory);

	// # Database
	//
	// Before anything else, you need to create an instance of `Database` with your credentials which will be referenced in your Collections and Models.
	//
	// ## Usage
	//
	// ```js
	// var f = require('firenze');
	// var Database = f.Database;
	// var MysqlAdapter = require('firenze-adapter-mysql');
	//
	// var db = new Database({
	//   adapter: MysqlAdapter,
	//   host: '127.0.0.1',
	//   database: 'my_database',
	//   user: '',
	//   password: '',
	//   pool: {
	//     min: 0,
	//     max: 1
	//   }
	// });
	// ```

	var Database = (function () {
	  function Database() {
	    var options = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Database);

	    this.defaultOptions = {
	      adapter: null,
	      host: null,
	      user: null,
	      database: null,
	      password: null,
	      prefix: null
	    };

	    this.options = _lodash2['default'].merge(this.defaultOptions, options);

	    var AdapterClass = this.options.adapter;
	    this.adapter = new AdapterClass(_lodash2['default'].omit(this.options, 'adapter'));

	    // ## Methods
	    //
	    // ### createCollectionClass(extend)
	    //
	    // Also aliased as `.Collection(extend)`.
	    //
	    this.createCollectionClass = this.Collection = (0, _commonCollectionFactory2['default'])(this);

	    // ### createModelClass(extend)
	    //
	    // Also aliased as `.Model(extend)`
	    //
	    this.createModelClass = this.Model = (0, _commonModelFactory2['default'])();
	  }

	  _createClass(Database, [{
	    key: 'getAdapter',

	    // ### getAdapter()
	    //
	    // Returns adapter
	    //
	    value: function getAdapter() {
	      return this.adapter;
	    }
	  }, {
	    key: 'getConnection',

	    // ### getConnection()
	    //
	    // Returns connection of the Adapter
	    //
	    value: function getConnection() {
	      return this.getAdapter().getConnection();
	    }
	  }, {
	    key: 'close',

	    // ### close(cb = null)
	    //
	    // Closes the connection
	    //
	    value: function close() {
	      var cb = arguments[0] === undefined ? null : arguments[0];

	      return this.getAdapter().closeConnection(cb);
	    }
	  }]);

	  return Database;
	})();

	exports['default'] = Database;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() { module.exports = this["_"]; }());

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _Model2 = __webpack_require__(4);

	var _Model3 = _interopRequireDefault(_Model2);

	module.exports = function () {
	  return function (extend) {
	    var GeneratedModel = (function (_Model) {
	      function GeneratedModel() {
	        var attributes = arguments[0] === undefined ? {} : arguments[0];

	        var _extend = arguments[1] === undefined ? {} : arguments[1];

	        _classCallCheck(this, GeneratedModel);

	        _get(Object.getPrototypeOf(GeneratedModel.prototype), 'constructor', this).call(this, attributes, _extend);
	        _lodash2['default'].merge(this, extend);
	      }

	      _inherits(GeneratedModel, _Model);

	      return GeneratedModel;
	    })(_Model3['default']);

	    return GeneratedModel;
	  };
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable new-cap */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _Promise = __webpack_require__(5);

	var _Promise2 = _interopRequireDefault(_Promise);

	var _validator = __webpack_require__(7);

	var _validator2 = _interopRequireDefault(_validator);

	var _async = __webpack_require__(8);

	var _async2 = _interopRequireDefault(_async);

	var _getParams = __webpack_require__(9);

	var _getParams2 = _interopRequireDefault(_getParams);

	// # Models
	//
	// A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.
	//

	var Model = (function () {

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
	  // If you are using ES6:
	  //
	  // ```js
	  // class Post extends f.Model {
	  //   constructor(attributes = {}, extend = {}) {
	  //     super(attributes, extend);
	  //   }
	  // }
	  // ```
	  //

	  function Model() {
	    var attributes = arguments[0] === undefined ? {} : arguments[0];
	    var extend = arguments[1] === undefined ? {} : arguments[1];

	    _classCallCheck(this, Model);

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

	    _lodash2['default'].merge(this, extend);

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

	  _createClass(Model, [{
	    key: 'collection',

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
	    // db.createModelClass({
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
	    // db.createModelClass({
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
	    // ### collection(options = {})
	    //
	    // Get the model's Collection's instance
	    //

	    value: function collection() {
	      var options = arguments[0] === undefined ? {} : arguments[0];

	      if (!this.collectionClass) {
	        return new Error('Cannot find any collectionClass');
	      }

	      var isInstance = function isInstance(i) {
	        return !_lodash2['default'].isFunction(i) && _lodash2['default'].isString(i.table);
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
	  }, {
	    key: 'get',

	    // ### get(field)
	    //
	    // Get the field of current model
	    //
	    value: function get(field) {
	      var obj = this.toObject();
	      return _lodash2['default'].get(obj, field);
	    }
	  }, {
	    key: 'set',

	    // ### set(field, value)
	    //
	    // Set an attribute with given value for the field
	    //
	    value: function set(field, value) {
	      if (_lodash2['default'].isObject(field)) {
	        return _lodash2['default'].merge(this.attributes, field);
	      }

	      return _lodash2['default'].set(this.attributes, field, value);
	    }
	  }, {
	    key: 'toObject',

	    // ### toObject()
	    //
	    // Returns a plain object of the model
	    //
	    value: function toObject() {
	      return this.attributes;
	    }
	  }, {
	    key: 'toJSON',

	    // ### toJSON()
	    //
	    // Alias of `.toObject()`.
	    //
	    value: function toJSON() {
	      return this.toObject();
	    }
	  }, {
	    key: 'fetch',

	    // ### fetch(options = {})
	    //
	    // Fetches the model again from the Database, and returns it with a promise.
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
	    value: function fetch() {
	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var id = this.getId();
	      if (!id) {
	        throw new Error('No ID found');
	      }

	      var collection = this.collection();
	      _lodash2['default'].merge(options, {
	        conditions: _defineProperty({}, this.alias + '.' + this.primaryKey, id)
	      });
	      return new _Promise2['default'](function (resolve, reject) {
	        return collection.find('first', options).then(function (model) {
	          resolve(model);
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'getId',

	    // ### getId()
	    //
	    // Get the ID of model
	    //
	    value: function getId() {
	      var id = this.id || this.get(this.primaryKey);
	      if (!_lodash2['default'].isUndefined(id)) {
	        return id;
	      }

	      return null;
	    }
	  }, {
	    key: 'isNew',

	    // ### isNew()
	    //
	    // Is the current model new? As in saved in Database, or yet to be saved?
	    //
	    value: function isNew() {
	      return this.getId() ? false : true;
	    }
	  }, {
	    key: 'save',

	    // ### save(options = {})
	    //
	    // Save the current model, and returns a promise.
	    //
	    // Options:
	    //
	    // * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
	    //
	    value: function save() {
	      var _this = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var callbacks = _lodash2['default'].isUndefined(options.callbacks) || options.callbacks ? true : false;

	      return new _Promise2['default'](function (resolve, reject) {
	        return _async2['default'].waterfall([function (cb) {
	          if (!callbacks) {
	            return cb(null, true);
	          }

	          return _this.beforeSave().then(function (proceed) {
	            if (proceed === true) {
	              return cb(null, proceed);
	            }

	            return cb(proceed);
	          });
	        }, function (proceed, cb) {
	          if (!_lodash2['default'].isUndefined(options.validate) && options.validate === false) {
	            return _this.collection().save(_this, options).then(function (model) {
	              return cb(null, model);
	            })['catch'](function (error) {
	              return cb(error);
	            });
	          }

	          return _this.validate().then(function (validated) {
	            if (validated === true) {
	              return _this.collection().save(_this, options).then(function (model) {
	                return cb(null, model);
	              })['catch'](function (error) {
	                return cb(error);
	              });
	            }

	            return cb({
	              validationErrors: validated
	            });
	          });
	        }, function (result, cb) {
	          if (!callbacks) {
	            return cb(null, _this);
	          }

	          return _this.afterSave().then(function () {
	            return cb(null, _this);
	          });
	        }], function (err, result) {
	          if (err) {
	            return reject(err);
	          }

	          return resolve(result);
	        });
	      });
	    }
	  }, {
	    key: 'saveField',

	    // ### saveField(field, value)
	    //
	    // Save a particular field with value.
	    //
	    // Returns a promise.
	    //
	    value: function saveField(field, value) {
	      this.set(field, value);
	      return this.save({
	        fields: [field]
	      });
	    }
	  }, {
	    key: 'clear',

	    // ### clear()
	    //
	    // Clear the current instance of model of any data
	    //
	    value: function clear() {
	      this.id = null;
	      this.attributes = {};
	    }
	  }, {
	    key: 'delete',

	    // ### delete(options = {})
	    //
	    // Delete the current model, and return a promise.
	    //
	    // Options:
	    //
	    // * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
	    //
	    value: function _delete() {
	      var _this2 = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var callbacks = _lodash2['default'].isUndefined(options.callbacks) || options.callbacks ? true : false;

	      return new _Promise2['default'](function (resolve, reject) {
	        return _async2['default'].waterfall([function (cb) {
	          if (!callbacks) {
	            return cb(null, true);
	          }

	          return _this2.beforeDelete().then(function (proceed) {
	            return cb(null, proceed);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }, function (proceed, cb) {
	          return _this2.collection()['delete'](_this2).then(function (res) {
	            return cb(null, res);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }, function (result, cb) {
	          return _this2.afterDelete().then(function () {
	            return cb(null, result);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }], function (err, result) {
	          if (err) {
	            return reject(err);
	          }

	          return resolve(result);
	        });
	      });
	    }
	  }, {
	    key: 'validate',

	    // ### validate()
	    //
	    // Validates all fields of the current Model
	    //
	    // Returns a promise with `true` if all validated, otherwise an object of error messages keyed by field names.
	    //
	    // @TODO: `reject()` instead on error?
	    //
	    // Options:
	    //
	    // * `callbacks`: Defaults to true, pass false to disable before/after callbacks.
	    //
	    value: function validate() {
	      var _this3 //eslint-disable-line
	      = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var callbacks = _lodash2['default'].isUndefined(options.callbacks) || options.callbacks ? true : false;

	      return new _Promise2['default'](function (resolve, reject) {
	        return _async2['default'].waterfall([function (cb) {
	          if (!callbacks) {
	            return cb(null, true);
	          }

	          return _this3.beforeValidate().then(function (proceed) {
	            return cb(null, proceed);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }, function (proceed, cb) {
	          return _this3._validate().then(function (res) {
	            if (res === true) {
	              return cb(null, true);
	            }

	            return cb(res);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }, function (res, cb) {
	          if (!callbacks) {
	            return cb(null, res);
	          }

	          return _this3.afterValidate().then(function () {
	            return cb(null, res);
	          })['catch'](function (error) {
	            return cb(error);
	          });
	        }], function (err, result) {
	          if (err) {
	            if (_lodash2['default'].isObject(err)) {
	              return resolve(err);
	            }

	            return reject(err);
	          }

	          return resolve(result);
	        });
	      });
	    }
	  }, {
	    key: '_validate',
	    value: function _validate() {
	      var _this4 = this;

	      //eslint-disable-line
	      var fields = [];
	      _lodash2['default'].each(this.toObject(), function (v, field) {
	        if (!_lodash2['default'].isObject(v)) {
	          fields.push(field);
	        }
	      });

	      _lodash2['default'].each(this.schema, function (schema, field) {
	        if (_lodash2['default'].isUndefined(schema.validate)) {
	          return;
	        }

	        if (_lodash2['default'].isObject(schema.validate) && schema.validate.required) {
	          fields.push(field);
	          return;
	        }

	        if (!_lodash2['default'].isArray(schema.validate)) {
	          return;
	        }

	        _lodash2['default'].each(schema.validate, function (ruleObj) {
	          if (ruleObj.required) {
	            fields.push(field);
	          }
	        });
	      });

	      fields = _lodash2['default'].uniq(fields);
	      var list = {};

	      return new _Promise2['default'](function (resolve, reject) {
	        _async2['default'].mapSeries(fields, function (field, cb) {
	          _this4.validateField(field).then(function (validated) {
	            if (validated !== true) {
	              list[field] = validated;
	            }

	            cb();
	          })['catch'](function (error) {
	            cb(error);
	          });
	        }, function (err) {
	          if (err) {
	            return reject(err);
	          }

	          if (_lodash2['default'].isEmpty(list)) {
	            return resolve(true);
	          }

	          return resolve(list);
	        });
	      });
	    }
	  }, {
	    key: 'validateField',

	    // ### validateField(field, value = null)
	    //
	    // Validates a single field
	    //
	    // Returns a promise with true if validated, otherwise error message
	    //
	    value: function validateField(field) {
	      var _this5 = this;

	      var value = arguments[1] === undefined ? null : arguments[1];

	      if (!value) {
	        value = this.get(field);
	      }

	      var fieldSchema = this.schema[field];
	      if (!_lodash2['default'].isObject(fieldSchema) || !fieldSchema.validate) {
	        return new _Promise2['default'].resolve(true); //eslint-disable-line
	      }

	      var validate = fieldSchema.validate;
	      if (!_lodash2['default'].isArray(validate)) {
	        validate = [validate];
	      }

	      return new _Promise2['default'](function (resolve) {
	        _async2['default'].eachSeries(validate, function (ruleObj, cb) {
	          var rule = ruleObj.rule;
	          var ruleName = undefined;
	          var ruleOptions = [];
	          var message = ruleObj.message;

	          var validatorFunc = undefined;
	          var validatorOptions = undefined;

	          if (_lodash2['default'].isString(rule)) {
	            ruleName = rule;
	          } else if (_lodash2['default'].isArray(rule)) {
	            ruleName = _lodash2['default'].first(rule);
	            ruleOptions = _lodash2['default'].rest(rule);
	          }

	          if (_lodash2['default'].isFunction(rule)) {
	            // rule is a direct function
	            validatorFunc = rule;
	            validatorOptions = [field, value];
	          } else if (ruleName && _lodash2['default'].isFunction(_this5.validationRules[ruleName])) {
	            // rule is an pre-defined function
	            validatorFunc = _this5.validationRules[ruleName];
	            validatorOptions = [field, value];
	          } else if (_lodash2['default'].isFunction(_validator2['default'][ruleName])) {
	            // validator.js
	            validatorFunc = _validator2['default'][ruleName];
	            validatorOptions = [value].concat(ruleOptions);
	          } else {
	            // no rule found
	            return cb(message);
	          }

	          var params = (0, _getParams2['default'])(validatorFunc);
	          if (_lodash2['default'].last(params) === 'done') {
	            // async
	            validatorOptions.push(function (passed) {
	              if (!passed) {
	                return cb(message);
	              }

	              cb();
	            });
	          } else {
	            // sync
	            var passed = validatorFunc.apply(_this5, validatorOptions);

	            if (!passed) {
	              return cb(message);
	            }

	            cb();
	          }
	        }, function (err) {
	          if (err) {
	            return resolve(err);
	          }

	          return resolve(true);
	        });
	      });
	    }
	  }, {
	    key: 'beforeSave',

	    // ## Callbacks
	    //
	    // Models also support callbacks that you can define when creating classes.
	    //
	    // For example:
	    //
	    // ```js
	    // var Promise = f.Promise;
	    // var Post = f.createModelClass({
	    //   alias: 'Post',
	    //
	    //   beforeSave: function () {
	    //     // do something before saving...
	    //
	    //     // end the callback with a promise
	    //     return new Promise.resolve(true);
	    //   }
	    // });
	    // ```
	    //

	    // ### beforeSave()
	    //
	    // Should return a Promise with `true` to continue.
	    //
	    // To stop the save, return a Promise with an error.
	    //
	    value: function beforeSave() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }, {
	    key: 'afterSave',

	    // ### afterSave()
	    //
	    // Should return a Promise.
	    //
	    value: function afterSave() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }, {
	    key: 'beforeValidate',

	    // ### beforeValidate()
	    //
	    // Should return a Promise with `true` to continue.
	    //
	    // To stop the validation, return a Promise with an error.
	    //
	    value: function beforeValidate() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }, {
	    key: 'afterValidate',

	    // ### afterValidate()
	    //
	    // Should return a Promise.
	    //
	    value: function afterValidate() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }, {
	    key: 'beforeDelete',

	    // ### beforeDelete()
	    //
	    // Should return a Promise with `true` to continue.
	    //
	    // To stop from deleting, return a Promise with an error.
	    //
	    value: function beforeDelete() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }, {
	    key: 'afterDelete',

	    // ### afterDelete()
	    //
	    // Should return a Promise.
	    //
	    value: function afterDelete() {
	      return new _Promise2['default'].resolve(true);
	    }
	  }]);

	  return Model;
	})();

	exports['default'] = Model;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _bluebird = __webpack_require__(6);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	exports['default'] = _bluebird2['default'];
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	(function() { module.exports = this["P"]; }());

/***/ },
/* 7 */
/***/ function(module, exports) {

	(function() { module.exports = this["validator"]; }());

/***/ },
/* 8 */
/***/ function(module, exports) {

	(function() { module.exports = this["async"]; }());

/***/ },
/* 9 */
/***/ function(module, exports) {

	/* global window */
	var GetParams = function (func) {
		'use strict';

		if (typeof func !== 'function') {
			return [];
		}

		var patternComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var patternArguments = /([^\s,]+)/g;

		var funcString = func
			.toString()
			.replace(patternComments, '');

		var result = funcString
			.slice(
				funcString.indexOf('(') + 1,
				funcString.indexOf(')')
			)
			.match(patternArguments);

		if (result === null) {
			return [];
		}

		return result;
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = GetParams;
	}

	if (typeof window !== 'undefined') {
		window.GetParams = GetParams;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _Collection2 = __webpack_require__(11);

	var _Collection3 = _interopRequireDefault(_Collection2);

	module.exports = function () {
	  var db = arguments[0] === undefined ? null : arguments[0];

	  return function (extend) {
	    var GeneratedCollection = (function (_Collection) {
	      function GeneratedCollection() {
	        var _extend = arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, GeneratedCollection);

	        _get(Object.getPrototypeOf(GeneratedCollection.prototype), 'constructor', this).call(this, _extend);

	        if (!this.getDatabase() && db) {
	          this.setDatabase(db);
	        }

	        _lodash2['default'].merge(this, extend);
	      }

	      _inherits(GeneratedCollection, _Collection);

	      return GeneratedCollection;
	    })(_Collection3['default']);

	    return GeneratedCollection;
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _Promise = __webpack_require__(5);

	var _Promise2 = _interopRequireDefault(_Promise);

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
	// If you are using ES6:
	//
	// ```js
	// class Posts extends f.Collection {
	//   constructor(extend = {}) {
	//     super(extend);
	//     this.setDatabase(db);
	//   }
	// }
	// ```
	//

	var Collection = (function () {
	  function Collection() {
	    var extend = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Collection);

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

	    _lodash2['default'].merge(this, extend);
	  }

	  _createClass(Collection, [{
	    key: 'model',

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
	    value: function model() {
	      var attributes = arguments[0] === undefined ? {} : arguments[0];
	      var extend = arguments[1] === undefined ? {} : arguments[1];

	      if (!this.modelClass) {
	        return new Error('Cannot find any modelClass');
	      }

	      var isInstance = function isInstance(i) {
	        return !_lodash2['default'].isFunction(i) && _lodash2['default'].isObject(i.schema);
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
	  }, {
	    key: 'getDatabase',

	    // ### getDatabase()
	    //
	    // Get in instance of the current Database
	    //
	    value: function getDatabase() {
	      return this.db;
	    }
	  }, {
	    key: 'getAdapter',

	    // ### getAdapter()
	    //
	    // Get adapter of the Collections' database
	    //
	    value: function getAdapter() {
	      return this.getDatabase().getAdapter();
	    }
	  }, {
	    key: 'setDatabase',

	    // ### setDatabase(db)
	    //
	    // Change database instance of this Collection to `db`
	    //
	    value: function setDatabase(db) {
	      this.db = db;
	    }
	  }, {
	    key: 'query',

	    // ### query(options = {})
	    //
	    // Get query object for this Collection
	    //
	    value: function query() {
	      var options = arguments[0] === undefined ? {} : arguments[0];

	      return this.getAdapter().query(this, options);
	    }
	  }, {
	    key: 'find',

	    // ### find(type, options = {})
	    //
	    // Explained above in `finders` section
	    //
	    value: function find() {
	      var type = arguments[0] === undefined ? null : arguments[0];
	      var options = arguments[1] === undefined ? {} : arguments[1];

	      if (!type || !this.finders[type] || !_lodash2['default'].isFunction(this[this.finders[type]])) {
	        throw new Error('Invalid find type');
	      }

	      return this[this.finders[type]](options);
	    }
	  }, {
	    key: 'findAll',

	    // ### findAll(options = {})
	    //
	    // Returns a promise with matched results.
	    //
	    // Same as `collection.find('all', options)`.
	    //
	    value: function findAll() {
	      var _this = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var q = this.query(options);

	      return new _Promise2['default'](function (resolve, reject) {
	        return _this.getAdapter().read(q).then(function (results) {
	          var models = [];
	          _lodash2['default'].each(results, function (v) {
	            models.push(_this.model(v));
	          });
	          return resolve(models);
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'findFirst',

	    // ### findFirst(options = {})
	    //
	    // Returns a promise with matched model if any.
	    //
	    // Same as `collection.find('first', options)`.
	    //
	    value: function findFirst() {
	      var _this2 = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var q = this.query(_lodash2['default'].merge(options, {
	        limit: 1
	      }));

	      return new _Promise2['default'](function (resolve, reject) {
	        return _this2.getAdapter().read(q).then(function (results) {
	          if (results.length === 0) {
	            return resolve(null);
	          }

	          return resolve(_this2.model(results[0]));
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'findCount',

	    // ### findCount(options = {})
	    //
	    // Returns a promise with count of matched results.
	    //
	    // Same as `collection.find('count', options)`.
	    //
	    value: function findCount() {
	      var _this3 = this;

	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var q = this.query(_lodash2['default'].merge(options, {
	        count: true
	      }));

	      return new _Promise2['default'](function (resolve, reject) {
	        return _this3.getAdapter().read(q).then(function (results) {
	          if (results.length === 0) {
	            return resolve(null);
	          }

	          var firstKey = _lodash2['default'].first(_lodash2['default'].keys(results[0]));
	          var count = results[0][firstKey];

	          return resolve(count);
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'findList',

	    // ### findList(options = {})
	    //
	    // Returns a promise with key/value pair of matched results.
	    //
	    // Same as `collection.find('list', options)`.
	    //
	    value: function findList() {
	      var options = arguments[0] === undefined ? {} : arguments[0];

	      var model = this.model();
	      if (!_lodash2['default'].isArray(options.fields)) {
	        options.fields = [model.primaryKey, model.displayField];
	      }

	      var q = this.query(options);

	      return new _Promise2['default'](function (resolve, reject) {
	        return q.then(function (results) {
	          var list = {};

	          _lodash2['default'].each(results, function (v) {
	            var listK = v[model.primaryKey];
	            var listV = v[model.displayField];
	            list[listK] = listV;
	          });

	          return resolve(list);
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'findBy',

	    // ### findBy(field, value, options = {})
	    //
	    // Shortcut method for finding a single record.
	    //
	    // Same as:
	    //
	    // ```js
	    // collection.find('first', {
	    //   conditions: {
	    //     field: value
	    //   }
	    // });
	    // ```
	    //
	    // Returns a promise.
	    //
	    value: function findBy(field, value) {
	      var options = arguments[2] === undefined ? {} : arguments[2];

	      return this.find('first', _lodash2['default'].merge({
	        conditions: _defineProperty({}, field, value)
	      }, options));
	    }
	  }, {
	    key: 'findById',

	    // ### findById(value, options = {})
	    //
	    // Shortcut method for finding record by ID.
	    //
	    // Same as:
	    //
	    // ```js
	    // collection.find('first', {
	    //   conditions: {
	    //     id: value // `id` key comes from `model.primaryKey
	    //   }
	    // });
	    // ```
	    //
	    // Returns a promise.
	    //
	    value: function findById(value) {
	      var options = arguments[1] === undefined ? {} : arguments[1];

	      return this.findBy(this.primaryKey, value, options);
	    }
	  }, {
	    key: 'findByKey',

	    // ### findByKey(value, options = {})
	    //
	    // Alias for `collection.findById()`.
	    //
	    // Returns a promise.
	    //
	    value: function findByKey(value) {
	      var options = arguments[1] === undefined ? {} : arguments[1];

	      return this.findById(value, options);
	    }
	  }, {
	    key: 'save',

	    // ### save(model, options = {})
	    //
	    // Save the given model. This method is not usually called directly, but rather via `Model.save()`.
	    //
	    // Returns a promise with model instance.
	    //
	    value: function save(model) {
	      var _this4 = this;

	      var options = arguments[1] === undefined ? {} : arguments[1];

	      var obj = model.toObject();
	      return new _Promise2['default'](function (resolve, reject) {
	        var promise = null;
	        var q = null;

	        if (model.isNew()) {
	          q = _this4.query({
	            alias: false
	          });
	          promise = _this4.getAdapter().create(q, obj);
	        } else {
	          obj = _lodash2['default'].omit(obj, model.primaryKey);
	          if (_lodash2['default'].isArray(options.fields)) {
	            obj = _lodash2['default'].pick(obj, options.fields);
	          }

	          q = _this4.query({
	            alias: false,
	            conditions: _defineProperty({}, model.primaryKey, model.getId())
	          });
	          promise = _this4.getAdapter().update(q, obj);
	        }

	        promise.then(function (ids) {
	          var id = null;
	          if (_lodash2['default'].isArray(ids) && ids.length === 0 || !ids) {
	            return resolve(id);
	          } else if (_lodash2['default'].isArray(ids)) {
	            id = ids[0];
	          } else {
	            id = ids;
	          }

	          return _this4.model({ id: id }).fetch().then(function (m) {
	            resolve(m);
	          })['catch'](function (error) {
	            reject(error);
	          });
	        })['catch'](reject);
	      });
	    }
	  }, {
	    key: 'delete',

	    // ### delete(model)
	    //
	    // Deletes the given model. Usually called via `Model.delete()`.
	    //
	    // Returns a promise.
	    //
	    value: function _delete(model) {
	      var _this5 = this;

	      return new _Promise2['default'](function (resolve, reject) {
	        if (model.isNew()) {
	          var error = new Error('Cannot delete a model without ID');
	          return reject(error);
	        }

	        var q = _this5.query({
	          alias: false,
	          conditions: _defineProperty({}, model.primaryKey, model.getId())
	        });

	        return _this5.getAdapter()['delete'](q).then(resolve)['catch'](reject);
	      });
	    }
	  }]);

	  return Collection;
	})();

	exports['default'] = Collection;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _async = __webpack_require__(8);

	var _async2 = _interopRequireDefault(_async);

	var _Promise = __webpack_require__(5);

	var _Promise2 = _interopRequireDefault(_Promise);

	// # Adapter
	//
	// Adapter is responsible for making the actual database operations.
	//

	var Adapter = (function () {
	  // ## Usage
	  //
	  // You would hardly ever need to create an instance of a Adapter. Database class would take care of it.
	  //
	  // An adapter instance is created with the same options passed when creating a Database instance:
	  //
	  // For example, if you are using MySQL adapter, it would be like this:
	  //
	  // ```
	  // $ npm install --save firenze-adapter-mysql
	  // ```
	  //
	  // Now let's create an instance of Database:
	  //
	  // ```js
	  // var f = require('firenze');
	  // var Database = f.Database;
	  // var MysqlAdapter = require('firenze-adapter-mysql');
	  //
	  // var db = new Database({
	  //   adapter: MysqlAdapter,
	  //   host: '127.0.0.1',
	  //   database: 'my_database',
	  //   user: '',
	  //   password: ''
	  // });
	  // ```
	  //

	  function Adapter() {
	    var options = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Adapter);
	  }

	  _createClass(Adapter, [{
	    key: 'getConnection',

	    // ## Methods
	    //
	    // Every adapter needs to implement at least these methods below:
	    //
	    // ### getConnection()
	    //
	    // Returns the current connection
	    //
	    value: function getConnection() {
	      return null;
	    }
	  }, {
	    key: 'closeConnection',

	    // ### closeConnection(cb = null)
	    //
	    // Closes the current connection, and calls the callback function `cb()` if passed.
	    //
	    value: function closeConnection() {
	      var cb = arguments[0] === undefined ? null : arguments[0];

	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      }).then(function () {
	        if (_lodash2['default'].isFunction(cb)) {
	          return cb();
	        }
	      });
	    }
	  }, {
	    key: 'query',

	    // ### query()
	    //
	    // Gets a query object
	    //
	    value: function query() {
	      var options = arguments[0] === undefined ? {} : arguments[0];
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'create',

	    // ### create(q, obj)
	    //
	    // Creates a new record
	    //
	    value: function create(q, obj) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'read',

	    // ### read(q)
	    //
	    // Fetches the results found against the query object
	    //
	    value: function read(q) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'update',

	    // ### update(q, obj)
	    //
	    // Updates the records matching againt query object with given data
	    //
	    value: function update(q, obj) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'delete',

	    // ### delete(q)
	    //
	    // Deletes the records matching against query object
	    //
	    value: function _delete(q) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'dropTable',

	    // ### dropTable(model)
	    //
	    // Drop table if exists
	    //
	    value: function dropTable(model) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'createTable',

	    // ### createTable(model)
	    //
	    // Create table based on model's schema
	    //
	    value: function createTable(model) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'populateTable',

	    // ### populateTable(model, rows)
	    //
	    // Insert rows into model's table
	    //
	    value: function populateTable(model, rows) {
	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve) {
	        return resolve();
	      });
	    }
	  }, {
	    key: 'loadFixture',

	    // ### loadFixture(model, rows)
	    //
	    // Creates table, and loads data for given model
	    //
	    value: function loadFixture(model, rows) {
	      var _this = this;

	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve, reject) {
	        _async2['default'].series([function (callback) {
	          _this.dropTable(model).then(function (response) {
	            callback(null, response);
	          })['catch'](function (error) {
	            callback(error);
	          });
	        }, function (callback) {
	          _this.createTable(model).then(function (response) {
	            callback(null, response);
	          })['catch'](function (error) {
	            callback(error);
	          });
	        }, function (callback) {
	          _this.populateTable(model, rows).then(function (response) {
	            callback(null, response);
	          })['catch'](function (error) {
	            callback(error);
	          });
	        }], function (err, results) {
	          if (err) {
	            return reject(err);
	          }

	          return resolve(results);
	        });
	      });
	    }
	  }, {
	    key: 'loadAllFixtures',

	    // ### loadAllFixtures(arr)
	    //
	    // Runs fixtures for multiple models
	    //
	    // arr = [{model: post, rows: rows}]
	    //
	    value: function loadAllFixtures(arr) {
	      var _this2 = this;

	      //eslint-disable-line
	      return new _Promise2['default'](function (resolve, reject) {
	        _async2['default'].map(arr, function (fixture, callback) {
	          _this2.loadFixture(fixture.model, fixture.rows).then(function (results) {
	            callback(null, results);
	          })['catch'](function (error) {
	            callback(error);
	          });
	        }, function (err, results) {
	          if (err) {
	            return reject(err);
	          }

	          return resolve(results);
	        });
	      });
	    }
	  }]);

	  return Adapter;
	})();

	exports['default'] = Adapter;
	module.exports = exports['default'];
	//eslint-disable-line

/***/ }
/******/ ]);