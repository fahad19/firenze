# firenze.js

[![Build Status](https://secure.travis-ci.org/fahad19/firenze.png?branch=master)](http://travis-ci.org/fahad19/firenze)

Install it with npm:

```
$ npm install --save firenze
```

---

firenze.js is a node.js object relational mapper targetting SQL databases.

Key features include:

* Written in ES6 (works in both node and io.js)
* Adapter based structure to plug in any database
* Promise based workflow
* Strong validation support

The project is still in heavy development, and more features are expected to land in future releases.

Terminologies for developing with firenze.js can be broken down into a handful of items:

* Database
  * Adapter
* Collection
* Model

Each of them are discussed in the documentation below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Quickstart](#quickstart)
- [Database](#database)
  - [Usage](#usage)
  - [Methods](#methods)
    - [createCollectionClass(extend)](#createcollectionclassextend)
    - [createModelClass(extend)](#createmodelclassextend)
    - [getAdapter()](#getadapter)
    - [getConnection()](#getconnection)
    - [close(cb = null)](#closecb--null)
- [Adapter](#adapter)
  - [Available adapters](#available-adapters)
  - [Usage](#usage-1)
  - [Methods](#methods-1)
    - [getConnection()](#getconnection-1)
    - [closeConnection(cb = null)](#closeconnectioncb--null)
    - [query()](#query)
    - [create(q, obj)](#createq-obj)
    - [read(q)](#readq)
    - [update(q, obj)](#updateq-obj)
    - [delete(q)](#deleteq)
    - [dropTable(model)](#droptablemodel)
    - [createTable(model)](#createtablemodel)
    - [populateTable(model, rows)](#populatetablemodel-rows)
    - [loadFixture(model, rows)](#loadfixturemodel-rows)
    - [loadAllFixtures(arr)](#loadallfixturesarr)
- [Collection](#collection)
  - [Creating classes](#creating-classes)
    - [Properties](#properties)
      - [modelClass](#modelclass)
      - [table](#table)
      - [finders](#finders)
  - [Usage](#usage-2)
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
    - [save(model, options = {})](#savemodel-options--)
    - [delete(model)](#deletemodel)
- [Models](#models)
  - [Creating classes](#creating-classes-1)
    - [Properties](#properties-1)
      - [collectionClass](#collectionclass)
      - [schema](#schema)
      - [attributes](#attributes)
      - [primaryKey](#primarykey)
      - [displayField](#displayfield)
      - [id](#id)
      - [validationRules](#validationrules)
      - [alias](#alias)
  - [Usage](#usage-3)
  - [Validations](#validations)
    - [Single rule](#single-rule)
    - [Multiple rules](#multiple-rules)
    - [Rule with options](#rule-with-options)
    - [Rule as a function](#rule-as-a-function)
    - [Asynchronouse rule](#asynchronouse-rule)
    - [Available rules](#available-rules)
    - [Custom rules](#custom-rules)
    - [Required fields](#required-fields)
  - [Methods](#methods-3)
    - [collection(options = {})](#collectionoptions--)
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
    - [validate()](#validate)
    - [validateField(field, value = null)](#validatefieldfield-value--null)
  - [Callbacks](#callbacks)
    - [beforeSave()](#beforesave)
    - [afterSave()](#aftersave)
    - [beforeValidate()](#beforevalidate)
    - [afterValidate()](#aftervalidate)
    - [beforeDelete()](#beforedelete)
    - [afterDelete()](#afterdelete)
- [Testing](#testing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quickstart

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

// define a Collection, which represents a table
var Posts = db.createCollectionClass({ // or db.Collection()
  table: 'posts',

  modelClass: function () {
    return Post;
  }
  // or modelClass: Post
});

// define a Model, which represents a record
var Post = db.createModelClass({ // or db.Model()
  alias: 'Post',

  collectionClass: Posts, // or a function that returns Posts

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

  // or convert to plain object
  var postObject = post.toObject();
  var title = postObject.title;
});

// saving
var post = new Post({
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

### createModelClass(extend)

Also aliased as `.Model(extend)`

### getAdapter()

Returns adapter

### getConnection()

Returns connection of the Adapter

### close(cb = null)

Closes the connection

<!--/docume:src/Database.js-->

<!--docume:src/Adapter.js-->
# Adapter

Adapter is responsible for making the actual database operations.

## Available adapters

You can find further documentation on querying on their own sites:

* [MySQL](https://github.com/fahad19/firenze-adapter-mysql)

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

Closes the current connection, and calls the callback function `cb()` if passed.

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

### dropTable(model)

Drop table if exists

### createTable(model)

Create table based on model's schema

### populateTable(model, rows)

Insert rows into model's table

### loadFixture(model, rows)

Creates table, and loads data for given model

### loadAllFixtures(arr)

Runs fixtures for multiple models

arr = [{model: post, rows: rows}]

<!--/docume:src/Adapter.js-->

<!--docume:src/Collection.js-->
# Collection

A collection represents a table. If you have a `posts` table, most likely you would have a collection for it called `Posts`.

## Creating classes

You can create a Collection class from your Database instance. And it requires minimum two properies, `table`, and `modelClass`:

```js
var Posts = db.createCollectionClass({
  table: 'posts',

  modelClass: function () {
    return Post;
  }
});
```

There is also a short method for creating Collection class via `db.Collection()`.

You can also create a Collection class like this:

```js
var Posts = f.createCollectionClass({
  db: db, // instance of your Database

  table: 'posts',

  // ...
});
```

If you are using ES6:

```js
class Posts extends f.Collection {
  constructor(extend = {}) {
    super(extend);
    this.setDatabase(db);
  }
}
```

### Properties

#### modelClass

Every collection requires a Model for representing its records. This property can directly reference to the Model class, or it can be a function that returns the Model class.

#### table

The name of the table that this Collection represents. Always as a string.

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

## Usage

Before using the Collection, you need to create an instance of it:

```js
var posts = new Posts();
```

## Methods

### model(attributes = {}, extend = {})

Get an instance of this Collection's model

### getDatabase()

Get in instance of the current Database

### getAdapter()

Get adapter of the Collections' database

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

### save(model, options = {})

Save the given model. This method is not usually called directly, but rather via `Model.save()`.

Returns a promise with model instance.

### delete(model)

Deletes the given model. Usually called via `Model.delete()`.

Returns a promise.

<!--/docume:src/Collection.js-->

<!--docume:src/Model.js-->
# Models

A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular for, which is `Post`.

## Creating classes

You can create a Model class from your Database instance. And it can be created as follows:

```js
var Post = db.createModelClas({
  alias: 'Post',

  displayField: 'title',

  schema: {
    id: {
      type: 'increments'
    },
    title: {
      type: 'string'
    }
  },

  collectionClass: Posts
});
```

There is a short method for creating a Model class via `db.Model()`.

You can also create a Model class like this:

```js
var Post = f.createModelClass({
  // ...
});
```

If you are using ES6:

```js
class Post extends f.Model {
  constructor(attributes = {}, extend = {}) {
    super(attributes, extend);
  }
}
```

### Properties

#### collectionClass

Just like how Collection has a modelClass, models also need to have a collectionClass. It can be a direct reference to the class, or it can be a function that returns the class.

#### schema

Models do not necessarily need to define their full schema, but you would need them for building fixtures and also assigning validation rules for example later.

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

#### attributes

Your model's data

#### primaryKey

The name of the ID field, defaults to `id`.

#### displayField

This is the field that represents your record's display value. Usually `title` or `name` in most cases.

#### id

For convenience, stores the ID of the model in this property

#### validationRules

Example:

```js
{
  ruleName: function (field, value) {
    return true;
  },
  asyncRule: function (value, field, validated) {
    return validated(true);
  },
  ruleWithOptions: function (value, field, arg1, arg2) {
    return true;
  }
}
```

#### alias

Unless defined, alias always defaults to the table name as defined in the Collection class of a Model. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.

## Usage

Unless otherwise you are already provided with a model instance from a Collection, you need to create an instance of it:

```js
var post = new Post();
```

You can also create an instance of a Model with some data:

```js
var post = new Post({
  title: 'Hello World',
  body: 'blah...'
});
```

## Validations

Validation rules for fields can be set when defining the schema:

### Single rule

```js
db.createModelClass({
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
db.createModelClass({
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

Validation rules can be defined when creating a Model class:

```js
var Post = db.createModelClass({
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
var Post = db.createModelClass({
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

### collection(options = {})

Get the model's Collection's instance

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
var post = new Post({id: 1});
post.fetch().then(function (model) {
  var title = model.get('title');
});
```

### getId()

Get the ID of model

### isNew()

Is the current model new? As in saved in Database, or yet to be saved?

### save(options = {})

Save the current model, and returns a promise.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### saveField(field, value)

Save a particular field with value.

Returns a promise.

### clear()

Clear the current instance of model of any data

### delete(options = {})

Delete the current model, and return a promise.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### validate()

Validates all fields of the current Model

Returns a promise with `true` if all validated, otherwise an object of error messages keyed by field names.

@TODO: `reject()` instead on error?

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### validateField(field, value = null)

Validates a single field

Returns a promise with true if validated, otherwise error message

## Callbacks

Models also support callbacks that you can define when creating classes.

For example:

```js
var Promise = f.Promise;
var Post = f.createModelClass({
  alias: 'Post',

  beforeSave: function () {
    // do something before saving...

    // end the callback with a promise
    return new Promise.resolve(true);
  }
});
```

### beforeSave()

Should return a Promise with `true` to continue.

To stop the save, return a Promise with an error.

### afterSave()

Should return a Promise.

### beforeValidate()

Should return a Promise with `true` to continue.

To stop the validation, return a Promise with an error.

### afterValidate()

Should return a Promise.

### beforeDelete()

Should return a Promise with `true` to continue.

To stop from deleting, return a Promise with an error.

### afterDelete()

Should return a Promise.

<!--/docume:src/Model.js-->

<!--docume:node_modules/firenze-adapter-mysql/src/index.js-->
<!--/docume:node_modules/firenze-adapter-mysql/src/index.js-->

# Testing

Tests are written with [mocha](http://visionmedia.github.com/mocha/), and can be run via npm:

```
$ npm test
```

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
