# firenze.js

[![Build Status](https://img.shields.io/travis/fahad19/firenze/master.svg)](http://travis-ci.org/fahad19/firenze) [![Coverage Status](https://coveralls.io/repos/fahad19/firenze/badge.svg?branch=master)](https://coveralls.io/r/fahad19/firenze?branch=master) [![npm](https://img.shields.io/npm/v/firenze.svg)](https://www.npmjs.com/package/firenze) [![Join the chat at https://gitter.im/fahad19/firenze](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-1dce73.svg)](https://gitter.im/fahad19/firenze)

Install it with [npm](https://npmjs.com):

```
$ npm install --save firenze
```

Or [Bower](http://bower.io):

```
$ bower install --save firenze
```

---

firenze.js is a adapter-based object relational mapper written in ES6 targetting node.js, io.js and the browser.

#### Key features

* Works in both node/io.js and the browser
* Adapter based structure to plug in any database/store
* Highly extensible with Behavior pattern
* Promise based workflow
* Strong validation support
* Small footprint of ~30kB minified file

The project is still in heavy development, and more features are expected to land in future releases.

#### Available adapters

* [localStorage](https://github.com/fahad19/firenze-adapter-localstorage) (for browser only)
* [Memory](https://github.com/fahad19/firenze-adapter-memory) (works in both node and the browser)
* [MySQL](https://github.com/fahad19/firenze-adapter-mysql)
* [Redis](https://github.com/fahad19/firenze-adapter-redis)
* [SQLite](https://github.com/alexweber/firenze-adapter-sqlite)

#### Available behaviors

* [Slug](https://github.com/fahad19/firenze-behavior-slug)

#### Terminologies

Terminologies for developing with firenze.js can be broken down into a handful of items:

* Database
* Adapter
* Collection
* Model
* Behavior

Each of them are discussed in the documentation below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Install](#install)
  - [Node.js](#nodejs)
  - [io.js](#iojs)
  - [Browser](#browser)
- [Quickstart](#quickstart)
- [Database](#database)
  - [Usage](#usage)
  - [Methods](#methods)
    - [createCollectionClass(extend)](#createcollectionclassextend)
    - [getAdapter()](#getadapter)
    - [getConnection()](#getconnection)
    - [close(cb = null)](#closecb--null)
- [Adapter](#adapter)
  - [Usage](#usage-1)
  - [Methods](#methods-1)
    - [getConnection()](#getconnection-1)
    - [closeConnection(cb = null)](#closeconnectioncb--null)
    - [query()](#query)
    - [create(q, obj)](#createq-obj)
    - [read(q)](#readq)
    - [update(q, obj)](#updateq-obj)
    - [delete(q)](#deleteq)
    - [dropTable(collection)](#droptablecollection)
    - [createTable(collection)](#createtablecollection)
    - [populateTable(collection, rows)](#populatetablecollection-rows)
    - [loadFixture(collection, rows)](#loadfixturecollection-rows)
    - [loadAllFixtures(arr)](#loadallfixturesarr)
- [Collection](#collection)
  - [Creating classes](#creating-classes)
    - [Properties](#properties)
      - [modelClass](#modelclass)
      - [table](#table)
      - [schema](#schema)
      - [primaryKey](#primarykey)
      - [displayField](#displayfield)
      - [validationRules](#validationrules)
      - [behaviors](#behaviors)
      - [loadedBehaviors](#loadedbehaviors)
      - [finders](#finders)
      - [alias](#alias)
  - [Usage](#usage-2)
  - [Validations](#validations)
    - [Single rule](#single-rule)
    - [Multiple rules](#multiple-rules)
    - [Rule with options](#rule-with-options)
    - [Rule as a function](#rule-as-a-function)
    - [Asynchronouse rule](#asynchronouse-rule)
    - [Available rules](#available-rules)
    - [Custom rules](#custom-rules)
    - [Required fields](#required-fields)
  - [Methods](#methods-2)
    - [model(attributes = {}, extend = {})](#modelattributes---extend--)
    - [getDatabase()](#getdatabase)
    - [getAdapter()](#getadapter-1)
    - [setDatabase(db)](#setdatabasedb)
    - [query(options = {})](#queryoptions--)
    - [find(type, options = {})](#findtype-options--)
    - [findAll(options = {})](#findalloptions--)
    - [findFirst(options = {})](#findfirstoptions--)
    - [findCount(options = {})](#findcountoptions--)
    - [findList(options = {})](#findlistoptions--)
    - [findBy(field, value, options = {})](#findbyfield-value-options--)
    - [findById(value, options = {})](#findbyidvalue-options--)
    - [findByKey(value, options = {})](#findbykeyvalue-options--)
    - [validate()](#validate)
    - [validateField(model, field, value = null)](#validatefieldmodel-field-value--null)
    - [save(model, options = {})](#savemodel-options--)
    - [delete(model)](#deletemodel)
    - [loadBehaviors()](#loadbehaviors)
    - [callBehavedMethod(methodName)](#callbehavedmethodmethodname)
  - [Callbacks](#callbacks)
    - [modelInitialize(model)](#modelinitializemodel)
    - [beforeSave(model)](#beforesavemodel)
    - [afterSave(model)](#aftersavemodel)
    - [beforeValidate(model)](#beforevalidatemodel)
    - [afterValidate(model)](#aftervalidatemodel)
    - [beforeDelete(model)](#beforedeletemodel)
    - [afterDelete(model)](#afterdeletemodel)
- [Models](#models)
  - [Creating classes](#creating-classes-1)
    - [Properties](#properties-1)
      - [attributes](#attributes)
      - [collection](#collection)
      - [id](#id)
  - [Usage](#usage-3)
  - [Methods](#methods-3)
    - [get(field)](#getfield)
    - [set(field, value)](#setfield-value)
    - [toObject()](#toobject)
    - [toJSON()](#tojson)
    - [fetch(options = {})](#fetchoptions--)
    - [getId()](#getid)
    - [isNew()](#isnew)
    - [save(options = {})](#saveoptions--)
    - [saveField(field, value)](#savefieldfield-value)
    - [clear()](#clear)
    - [delete(options = {})](#deleteoptions--)
    - [validate()](#validate-1)
    - [validateField(field, value = null)](#validatefieldfield-value--null)
- [Behavior](#behavior)
  - [Usage](#usage-4)
  - [Creating classes](#creating-classes-2)
  - [Properties](#properties-2)
    - [collection](#collection-1)
    - [options](#options)
  - [Callback methods](#callback-methods)
    - [collectionInitialize(collection)](#collectioninitializecollection)
    - [modelInitialize(model)](#modelinitializemodel-1)
    - [beforeSave(model)](#beforesavemodel-1)
    - [afterSave(model)](#aftersavemodel-1)
    - [beforeValidate(model)](#beforevalidatemodel-1)
    - [afterValidate(model)](#aftervalidatemodel-1)
    - [beforeDelete(model)](#beforedeletemodel-1)
    - [afterDelete(model)](#afterdeletemodel-1)
- [Testing](#testing)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Releases](#releases)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Install

firenze.js can be used in both node.js/io.js, as well as the browser.

## Node.js

```
$ npm install --save firenze
```

Now you can require it as follows:

```js
var firenze = require('firenze');
```

## io.js

Installation is same as Node.js since `npm` is the common package manager.

To import:

```js
import firenze from 'firenze';
```

## Browser

You can download firenze.js using [Bower](http://bower.io).

```js
$ bower install --save firenze
```

The package comes with multiple dist files, and you are free to choose whatever workflow suits you best.

If you want to include just one file alone with all the dependencies:

```html
<script src="bower_components/firenze/dist/firenze.full.min.js"></script>

<script>
// the library is now available in `firenze` variable
</script>
```

If you wish to include only the core library, and load its dependencies manually:

```html
<script src="bower_components/lodash/lodash.min.js"></script>
<script src="bower_components/async/lib/async.js"></script>
<script src="bower_components/bluebird/js/browser/bluebird.min.js"></script>
<script src="bower_components/validator-js/validator.min.js"></script>

<script src="bower_components/firenze/dist/firenze.min.js"></script>

<script>
// use `firenze` variable to access the library
</script>
```

# Quickstart

The example is targetting Node.js environment.

Install the module (along with an adapter) first:

```
$ npm install --save firenze firenze-adapter-mysql
```

Now you can proceed to managing your database as folllows:

```js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');

// create an instance of your Database
var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: '',
  password: ''
});

// define a Model, which represents a record
var Post = f.createModelClass({
  getLowercasedTitle: function () {
    return this.get('title').toLowerCase();
  }
});

// define a Collection, which represents a table
var Posts = db.createCollectionClass({ // or db.Collection()
  table: 'posts',

  alias: 'Post',

  modelClass: Post, // overriding Model class is optional

  schema: {
    id: {
      type: 'integer'
    },
    title: {
      type: 'string'
    },
    body: {
      type: 'text'
    }
  }

});

// finding
var posts = new Posts();
posts.find('first', {
  conditions: {
    id: 1
    // can also be prefixed with Model alias as:
    // 'Post.id': 1
  }
}).then(function (post) {
  // post in an instance of Model, with fetched data
  var title = post.get('title');

  // custom Model method
  var lowerCasedTitle = post.getLowercasedTitle();

  // or convert to plain object
  var postObject = post.toObject();
  var title = postObject.title;
});

// saving
var post = posts.model({
  title: 'Hello World',
  body: 'blah...'
});
post.save().then(function (model) {
  console.log('Saved with ID: ' + model.get('id'));
});
```

<!--docume:src/Database.js-->
# Database

Before anything else, you need to create an instance of `Database` with your credentials which will be referenced in your Collections and Models.

## Usage

```js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');

var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: '',
  password: '',
  pool: {
    min: 0,
    max: 1
  }
});
```
## Methods

### createCollectionClass(extend)

Also aliased as `.Collection(extend)`.

### getAdapter()

Returns adapter

### getConnection()

Returns connection of the Adapter

### close(cb = null)

Closes the connection

Returns a promise

<!--/docume:src/Database.js-->

<!--docume:src/Adapter.js-->
# Adapter

Adapter is responsible for making the actual database operations.

## Usage

You would hardly ever need to create an instance of a Adapter. Database class would take care of it.

An adapter instance is created with the same options passed when creating a Database instance:

For example, if you are using MySQL adapter, it would be like this:

```
$ npm install --save firenze-adapter-mysql
```

Now let's create an instance of Database:

```js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');

var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: '',
  password: ''
});
```

## Methods

Every adapter needs to implement at least these methods below:

### getConnection()

Returns the current connection

### closeConnection(cb = null)

Closes the current connection.

Returns a promise.

### query()

Gets a query object

### create(q, obj)

Creates a new record

### read(q)

Fetches the results found against the query object

### update(q, obj)

Updates the records matching againt query object with given data

### delete(q)

Deletes the records matching against query object

### dropTable(collection)

Drop table if exists

### createTable(collection)

Create table based on collection's schema

### populateTable(collection, rows)

Insert rows into collection's table

### loadFixture(collection, rows)

Creates table, and loads data for given collection

### loadAllFixtures(arr)

Runs fixtures for multiple collections

arr = [{collection: post, rows: rows}]

<!--/docume:src/Adapter.js-->

<!--docume:src/Collection.js-->
# Collection

A collection represents a table. If you have a `posts` table, most likely you would have a collection for it called `Posts`.

## Creating classes

You can create a Collection class from your Database instance. And it requires minimum one property: `table`:

```js
var Posts = db.createCollectionClass({
  table: 'posts',

  // optional
  modelClass: Post
});
```

There is also a short method for creating Collection class via `db.Collection()`.

You can also create a Collection class like this:

```js
var Posts = f.createCollectionClass({
  db: db, // instance of your Database

  table: 'posts'
});
```

If you are using ES6:

```js
import {Collection} from 'firenze';

class Posts extends Collection {
  constructor(extend = {}) {
    super(extend);
    this.setDatabase(db);
  }
}
```

### Properties

#### modelClass

Every collection requires a Model for representing its records. This property directly references to the Model class.

Be defalult, it is set to the base Model class, which you can always override.

#### table

The name of the table that this Collection represents. Always as a string.

#### schema

Collections do not necessarily need to define their full schema, but you would need them for building fixtures and also assigning validation rules for example later.

The keys of this object are the column names, and the value defines what type of column they are. For example:

```js
{
  id: {
    type: 'integer'
  },
  title: {
    type: 'string'
  }
}
```

Column types can vary depending on the adapter you are using.

You also use the `schema` property to set validation rules.

For example:

```js
{
  email: {
    type: 'string',
    validate: {
      rule: 'isEmail',
      message: 'Please enter a valid email address'
    }
  }
}
```

Validations will be discussed further later in its own section.

#### primaryKey

The name of the ID field, defaults to `id`.

#### displayField

This is the field that represents your record's display value. Usually `title` or `name` in most cases.

#### validationRules

Define rules logic which can be used for various fields.

Example:

```js
{
  ruleName: function (field, value) {
    return true;
  },
  asyncRule: function (value, field, done) {
    return done(true);
  },
  ruleWithOptions: function (value, field, arg1, arg2) {
    return true;
  }
}
```

#### behaviors

Array of behavior classes, in the order as you want them applied.

Example:

```js
[
  TimestampBehavior,
  AnotherCustomBehavior
]
```

#### loadedBehaviors

Array of already loaded behaviors for this model

#### finders

List of mapped finder methods that you want available in `.find(mappedName, options)`

By default these are set:

```js
{
  all: 'findAll',
  first: 'findFirst',
  count: 'findCount',
  list: 'findList'
}
```

This mapping allows you to later call `.find('all', options)`, which eventually calls `.findAll(options)`.

#### alias

Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.

## Usage

Before using the Collection, you need to create an instance of it:

```js
var posts = new Posts();
```

## Validations

Validation rules for fields can be set when defining the schema:

### Single rule

```js
db.createCollectionClass({
  schema: {
    email: {
      type: 'string',
      validate: {
        rule: 'isEmail',
        message: 'Please enter a valid email address'
      }
    }
  }
});
```

### Multiple rules

```js
{
  email: {
    type: 'string',
    validate: [
      {
        rule: 'isLowercase',
        message: 'Please enter email address in lowercase',
      },
      {
        rule: 'isEmail',
        message: 'Please enter a valid email address'
      }
    ]
  }
}
```

### Rule with options

```js
{
  fruit: {
    type: 'string',
    validate: {
      rule: [
       'isIn', // `isIn` is the rule name
       [
         'apple',
         'banana'
       ] // this array is passed as an argument to rule function
      ],
      message: 'Must be either apple or banana'
    }
  }
}
```

### Rule as a function

```js
{
  mood: {
    type: 'string',
    validate: {
      rule: function (field, value) {
        return true;
      }
    }
  }
}
```

### Asynchronouse rule

```js
{
  food: {
    type: 'string',
    validate: {
      rule: function (field, value, done) {
        checkIfFoodIsHealthy(value, function (healthy) {
          var isHealthy = healthy === true;
          done(isHealthy);
        });
      }
    }
  }
}
```

### Available rules

By default, all the validation rules from [Validator.js](https://github.com/chriso/validator.js#validators) is available:

- **equals(str, comparison)** - check if the string matches the comparison.
- **contains(str, seed)** - check if the string contains the seed.
- **matches(str, pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail(str [, options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, allow_utf8_local_part: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part.
- **isURL(str [, options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isFQDN(str [, options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isIP(str [, version])** - check if the string is an IP (version 4 or 6).
- **isAlpha(str)** - check if the string contains only letters (a-zA-Z).
- **isNumeric(str)** - check if the string contains only numbers.
- **isAlphanumeric(str)** - check if the string contains only letters and numbers.
- **isBase64(str)** - check if a string is base64 encoded.
- **isHexadecimal(str)** - check if the string is a hexadecimal number.
- **isHexColor(str)** - check if the string is a hexadecimal color.
- **isLowercase(str)** - check if the string is lowercase.
- **isUppercase(str)** - check if the string is uppercase.
- **isInt(str [, options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`).
- **isFloat(str [, options])** - check if the string is a float. `options` is an object which can contain the keys `min` and/or `max` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`).
- **isDivisibleBy(str, number)** - check if the string is a number that's divisible by another.
- **isNull(str)** - check if the string is null.
- **isLength(str, min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isByteLength(str, min [, max])** - check if the string's length (in bytes) falls in a range.
- **isUUID(str [, version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate(str)** - check if the string is a date.
- **isAfter(str [, date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore(str [, date])** - check if the string is a date that's before the specified date.
- **isIn(str, values)** - check if the string is in a array of allowed values.
- **isCreditCard(str)** - check if the string is a credit card.
- **isISIN(str)** - check if the string is an [ISIN][ISIN] (stock/security identifier).
- **isISBN(str [, version])** - check if the string is an ISBN (version 10 or 13).
- **isMobilePhone(str, locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM']`).
- **isJSON(str)** - check if the string is valid JSON (note: uses JSON.parse).
- **isMultibyte(str)** - check if the string contains one or more multibyte chars.
- **isAscii(str)** - check if the string contains ASCII chars only.
- **isFullWidth(str)** - check if the string contains any full-width chars.
- **isHalfWidth(str)** - check if the string contains any half-width chars.
- **isVariableWidth(str)** - check if the string contains a mixture of full and half-width chars.
- **isSurrogatePair(str)** - check if the string contains any surrogate pairs chars.
- **isMongoId(str)** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
- **isCurrency(str, options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.

Example usage of the above mentioned rules:

```js
db.createCollectionClass({
  schema: {
    title: {
      // direct rule
      validate: {
        rule: 'isAlphanumeric'
      }
    },
    body: {
      // rule with options
      validate: {
        rule: ['isLength', min, max]
      }
    }
  }
});
```

But of course, you can always override them or add new custom rules.

### Custom rules

Validation rules can be defined when creating a Collection class:

```js
var Posts = db.createCollectionClass({
  schema: {
    name: {
      type: 'string',
      validate: {
        rule: 'myFirstRule'
      }
    },
    title: {
      type: 'string',
      validate: {
        rule: [
          'myRuleWithOptions',
          'arg1 value',
          'arg2 value'
        ]
      }
    }
  },

  validationRules: {
    myFirstRule: function (field, value) {
      return true; // validated successfully
    },
    myRuleWithOptions: function (field, value, arg1, arg2) {
      return true;
    },
    myAsyncRule: function (field, value, done) {
      doSomething(value, function (result) {
        var validated = result === true;
        done(validated);
      });
    }
  }
});
```

### Required fields

By default, validation rules are only checked against fields that are set.

But if you wish to make sure that certain fields are required, meaning they should always be present, you can mark them as required in your schema:

```js
var Posts = db.createCollectionClass({
  schema: {
    name: {
      type: 'string',
      validate: {
        rule: 'isAlpha',
        required: true,
        message: 'Must be alphabets only'
      }
    }
  }
});
```

## Methods

### model(attributes = {}, extend = {})

Get an instance of this Collection's model

### getDatabase()

Get an instance of the current Database

### getAdapter()

Get adapter of the Collection's database

### setDatabase(db)

Change database instance of this Collection to `db`

### query(options = {})

Get query object for this Collection

### find(type, options = {})

Explained above in `finders` section

### findAll(options = {})

Returns a promise with matched results.

Same as `collection.find('all', options)`.

### findFirst(options = {})

Returns a promise with matched model if any.

Same as `collection.find('first', options)`.

### findCount(options = {})

Returns a promise with count of matched results.

Same as `collection.find('count', options)`.

### findList(options = {})

Returns a promise with key/value pair of matched results.

Same as `collection.find('list', options)`.

### findBy(field, value, options = {})

Shortcut method for finding a single record.

Same as:

```js
collection.find('first', {
  conditions: {
    field: value
  }
});
```

Returns a promise.

### findById(value, options = {})

Shortcut method for finding record by ID.

Same as:

```js
collection.find('first', {
  conditions: {
    id: value // `id` key comes from `model.primaryKey
  }
});
```

Returns a promise.

### findByKey(value, options = {})

Alias for `collection.findById()`.

Returns a promise.

### validate()

Validates all fields of the given Model

Returns a promise with `true` if all validated, otherwise an object of error messages keyed by field names.

@TODO: `reject()` instead on error?

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### validateField(model, field, value = null)

Validates a single field

Returns a promise with true if validated, otherwise error message

### save(model, options = {})

Save the given model. This method is not usually called directly, but rather via `Model.save()`.

Returns a promise with model instance.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### delete(model)

Deletes the given model. Usually called via `Model.delete()`.

Returns a promise.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### loadBehaviors()

Called during construction, and loads behaviors as defined in `behaviors` property.

### callBehavedMethod(methodName)

Used internally to call a callback method along with all the methods defined by loaded Behaviors too.

## Callbacks

Collections support callbacks that you can define when creating classes.

For example:

```js
var Promise = f.Promise;
var Posts = f.createCollectionClass({
  alias: 'Post',

  beforeSave: function (model) {
    // do something before saving...

    // end the callback with a promise
    return new Promise.resolve(true);
  }
});
```

### modelInitialize(model)

Called right after Collection's Model construction.

For synchronous operations only, since it does not return any Promise.

### beforeSave(model)

Should return a Promise with `true` to continue.

To stop the save, return a Promise with an error.

### afterSave(model)

Should return a Promise.

### beforeValidate(model)

Should return a Promise with `true` to continue.

To stop the validation, return a Promise with an error.

### afterValidate(model)

Should return a Promise.

### beforeDelete(model)

Should return a Promise with `true` to continue.

To stop from deleting, return a Promise with an error.

### afterDelete(model)

Should return a Promise.

<!--/docume:src/Collection.js-->

<!--docume:src/Model.js-->
# Models

A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.

## Creating classes

You can create a Model class as follows:

```js
var Post = f.createModelClass({
  // ...
});
```

If you are using ES6:

```js
import {Model} from 'firenze';

class Post extends Model {
  constructor(attributes = {}, extend = {}) {
    super(attributes, extend);
  }
}
```

### Properties

#### attributes

Your model's data

#### collection

Reference to the instantiated Collection

#### id

For convenience, stores the ID of the model in this property

## Usage

Ideally, you would be create a new Model instance via Collection:

```js
var posts = new Posts();
var post = posts.model({
  title: 'Hello World'
});
```

## Methods

### get(field)

Get the field of current model

### set(field, value)

Set an attribute with given value for the field

### toObject()

Returns a plain object of the model

### toJSON()

Alias of `.toObject()`.

### fetch(options = {})

Fetches the model again from the Database, and returns it with a promise.

A quick example:

```js
var post = posts.model({id: 1});
post.fetch().then(function (model) {
  var title = model.get('title');
});
```

Returns a promise.

### getId()

Get the ID of model

### isNew()

Is the current model new? As in saved in Database, or yet to be saved?

### save(options = {})

Save the current model, and returns a promise.

Calls `Collection.save()`.

Returns a promise.

### saveField(field, value)

Save a particular field with value.

Returns a promise.

### clear()

Clear the current instance of model of any data

### delete(options = {})

Delete the current model, and return a promise.

Calls `Collection.delete()`

### validate()

Validates all fields of the current Model

Calls `Collection.validate()`

### validateField(field, value = null)

Validates a single field

Calls `Collection.validateField()`

Returns a promise

<!--/docume:src/Model.js-->

<!--docume:src/Behavior.js-->
# Behavior

Behaviors allow you to hook into your Collections and Models and make them behave in a certain way. This allows for more re-usability in your code, since you can put common operations at Behavior level, and can then just assign the single Behavior to multiple Collections/Models.

## Usage

```js
var Posts = db.createCollectionClass({
  behaviors: [
    TimestampBehavior,
    AnotherBehavior
  ]
});
```

With custom configuration:

```js
var Posts = db.createCollectionClass({
  behaviors: [
    {
      'class': TimestampBehavior,
      options: {
        timezone: 'UTC'
      }
    },
    AnotherBehavior
  ]
});
```

## Creating classes

```js
var f = require('firenze');

var TimestampBehavior = f.createBehaviorClass({
  beforeSave: function (model) {
    model.set('created', new Date());
    return new f.Promise(true);
  }
});
```

If you are using ES6, the syntax is much simpler:

```js
import {Behavior, Promise} from 'firenze';

class TimestampBehavior extends Behavior {
  beforeSave(model) {
    model.set('created', new Date());
    return new Promise(true);
  }
}
```

## Properties

### collection

The current instance of collection

### options

Behavior configuration

## Callback methods

Behavior allows your to hook into your model's lifecycle callbacks.

The following callbacks are supported:

### collectionInitialize(collection)

Called right after collection's construction, synchronous operations only.


### modelInitialize(model)

Called right after model's construction, synchronous operations only.

### beforeSave(model)

Called before saving the model.

Returns a promise.

### afterSave(model)

Called after saving the model.

Returns a promise.

### beforeValidate(model)

Called before validating a model.

Returns a promise.

### afterValidate(model)

Called after validating a model.

Returns a promise.

### beforeDelete(model)

Called before deleting a model.

Returns a promise.

### afterDelete(model)

Called after deleting a model.

Returns a promise.

<!--/docume:src/Behavior.js-->

# Testing

Tests are written with [mocha](http://visionmedia.github.com/mocha/), and can be run via npm:

```
$ npm test
```

# Changelog

* [`v0.2.0`](https://github.com/fahad19/firenze/compare/v0.1.5...v0.2.0):
  * Model classes are now optional, as configuration has moved to Collection level.
  * Model classes cannot be created via Database instance any more
  * Behavior method signatures have changed (accepts context as first argument now).
  * Behavior `initialize` method has been renamed as `modelInitialize`.
  * Adapter's `closeConnection` method returns a Promise now.
  * Fixture loader , e.g. `Adapter.loadFixture()`, now accepts collection as argument instead of Model.
* [`v0.1.5`](https://github.com/fahad19/firenze/compare/v0.1.4...v0.1.5):
  * Added support for behaviors.
  * Added `model.initialize()` as a lifecycle callback.
  * Fix in MemoryAdapter for running tests.

# Contributing

* For each individual bug/fix/feature, please create a separate Issue/Pull Request.
* Make sure tests and inline documentation are written, and has good coverage.
* Run `npm run docs` and commit the updated README.
* Do not update the `dist` files.
* Be nice.

# Releases

To publish a new release:

* Update `package.json` and `bower.json` with version number.
* Run:
  * `npm run docs`
  * `npm run dist`
* Commit the changes.
* Run `npm publish .`
* Tag the repository with `vX.X.X`
* Update GitHub Pages.

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
