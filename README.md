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

firenze.js is a adapter-based object relational mapper written in ES6 targetting node.js and the browser.

#### Key features

* Adapter based structure to plug in any database/store
* Intuitive query builder
* Highly extensible with Behavior pattern
* Promise based workflow
* Strong validation support
* Small footprint of ~30kB minified file

The project is still under heavy development, and more features are expected to land in future releases.

#### Available adapters

* [localStorage](https://github.com/fahad19/firenze-adapter-localstorage) (for browser only)
* [Memory](https://github.com/fahad19/firenze-adapter-memory) (works in both node and the browser)
* [MySQL](https://github.com/fahad19/firenze-adapter-mysql)
* [Redis](https://github.com/fahad19/firenze-adapter-redis)
* [SQLite](https://github.com/alexweber/firenze-adapter-sqlite)

#### Available behaviors

* [Slug](https://github.com/fahad19/firenze-behavior-slug)
* [Timestamp](https://github.com/fahad19/firenze-behavior-timestamp)

#### Terminologies

Terminologies for developing with firenze.js can be broken down into these items:

* Database
* Adapter
* Query
* Collection
* Model
* Behavior

Each of them are discussed in the documentation below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Install](#install)
  - [Node.js](#nodejs)
  - [Browser](#browser)
- [Quickstart](#quickstart)
- [Database](#database)
  - [Usage](#usage)
  - [Methods](#methods)
    - [createCollection(extend)](#createcollectionextend)
    - [getAdapter()](#getadapter)
    - [query()](#query)
    - [schema()](#schema)
    - [getConnection()](#getconnection)
    - [close(cb = null)](#closecb--null)
- [Adapter](#adapter)
  - [Usage](#usage-1)
  - [Methods](#methods-1)
    - [getConnection()](#getconnection-1)
    - [closeConnection()](#closeconnection)
    - [query()](#query-1)
    - [schema()](#schema-1)
    - [populateTable(collection, rows)](#populatetablecollection-rows)
    - [loadFixture(collection, rows)](#loadfixturecollection-rows)
    - [loadAllFixtures(arr)](#loadallfixturesarr)
  - [Schema](#schema)
    - [Creating classes](#creating-classes)
    - [Properties](#properties)
      - [adapter](#adapter)
    - [Methods](#methods-2)
      - [getConnection()](#getconnection-2)
      - [dropTable(collection)](#droptablecollection)
      - [createTable(collection)](#createtablecollection)
- [Query](#query)
  - [Usage](#usage-2)
  - [Creating classes](#creating-classes-1)
  - [Properties](#properties-1)
    - [adapter](#adapter-1)
    - [collection](#collection)
  - [Methods](#methods-3)
    - [setAdapter(adapter)](#setadapteradapter)
    - [getAdapter()](#getadapter-1)
    - [setCollection(collection)](#setcollectioncollection)
    - [expr()](#expr)
    - [func()](#func)
    - [all()](#all)
    - [first()](#first)
    - [run()](#run)
    - [toModels(results)](#tomodelsresults)
    - [toModel(result)](#tomodelresult)
    - [tap(fn)](#tapfn)
    - [select()](#select)
      - [Array](#array)
      - [Arguments](#arguments)
      - [Object](#object)
      - [Function](#function)
    - [distinct(fields)](#distinctfields)
    - [from (table, alias = null)](#from-table-alias--null)
    - [table(table)](#tabletable)
    - [where()](#where)
    - [andWhere()](#andwhere)
    - [orWhere()](#orwhere)
    - [notWhere()](#notwhere)
    - [limit(number)](#limitnumber)
    - [page(number)](#pagenumber)
    - [offset(number)](#offsetnumber)
    - [orderBy(name, direction)](#orderbyname-direction)
    - [groupBy(column)](#groupbycolumn)
    - [count()](#count)
    - [create(row)](#createrow)
    - [update(row)](#updaterow)
    - [delete()](#delete)
    - [join(options)](#joinoptions)
    - [innerJoin(options)](#innerjoinoptions)
    - [leftJoin(options)](#leftjoinoptions)
    - [leftOuterJoin(options)](#leftouterjoinoptions)
    - [rightJoin(options)](#rightjoinoptions)
    - [rightOuterJoin(options)](#rightouterjoinoptions)
    - [outerJoin(options)](#outerjoinoptions)
    - [fullOuterJoin(options)](#fullouterjoinoptions)
    - [debug()](#debug)
  - [Expression](#expression)
    - [Usage](#usage-3)
    - [Creating classes](#creating-classes-2)
    - [Properties](#properties-2)
      - [query](#query)
      - [eq(column, value)](#eqcolumn-value)
      - [notEq(column, value)](#noteqcolumn-value)
      - [lt(column, value)](#ltcolumn-value)
      - [lte(column, value)](#ltecolumn-value)
      - [gt(column, value)](#gtcolumn-value)
      - [gte(column, value)](#gtecolumn-value)
      - [like(column, value)](#likecolumn-value)
      - [notLike(column, value)](#notlikecolumn-value)
      - [in(column, values)](#incolumn-values)
      - [notIn(column, values)](#notincolumn-values)
      - [isNull(column)](#isnullcolumn)
      - [isNotNull(column)](#isnotnullcolumn)
      - [between(column, from, to)](#betweencolumn-from-to)
      - [notBetween(column, from, to)](#notbetweencolumn-from-to)
      - [and()](#and)
      - [or()](#or)
      - [not()](#not)
  - [Functions](#functions)
    - [Usage](#usage-4)
    - [Creating classes](#creating-classes-3)
    - [Properties](#properties-3)
      - [query](#query-1)
      - [column](#column)
    - [Methods](#methods-4)
      - [setColumn(column)](#setcolumncolumn)
      - [upper()](#upper)
      - [lower()](#lower)
      - [sum()](#sum)
      - [avg()](#avg)
      - [min()](#min)
      - [max()](#max)
      - [count()](#count-1)
      - [now()](#now)
      - [year()](#year)
      - [month()](#month)
      - [day()](#day)
      - [week()](#week)
      - [weekday()](#weekday)
      - [concat()](#concat)
- [Collection](#collection)
  - [Creating classes](#creating-classes-4)
    - [Properties](#properties-4)
      - [modelClass](#modelclass)
      - [table](#table)
      - [schema](#schema)
      - [primaryKey](#primarykey)
      - [displayField](#displayfield)
      - [validationRules](#validationrules)
      - [behaviors](#behaviors)
      - [loadedBehaviors](#loadedbehaviors)
      - [alias](#alias)
  - [Usage](#usage-5)
  - [Validations](#validations)
    - [Single rule](#single-rule)
    - [Multiple rules](#multiple-rules)
    - [Rule with options](#rule-with-options)
    - [Rule as a function](#rule-as-a-function)
    - [Asynchronous rule](#asynchronous-rule)
    - [Available rules](#available-rules)
    - [Custom rules](#custom-rules)
    - [Required fields](#required-fields)
  - [Methods](#methods-5)
    - [model(attributes = {}, extend = {})](#modelattributes---extend--)
    - [getDatabase()](#getdatabase)
    - [setDatabase(db)](#setdatabasedb)
    - [getAdapter()](#getadapter-2)
    - [query()](#query-2)
    - [find()](#find)
    - [findBy(field, value)](#findbyfield-value)
    - [findAllBy(field, value)](#findallbyfield-value)
    - [findById(value)](#findbyidvalue)
    - [findByKey(value)](#findbykeyvalue)
    - [validate()](#validate)
    - [validateField(model, field, value = null)](#validatefieldmodel-field-value--null)
    - [save(model, options = {})](#savemodel-options--)
    - [delete(model, options = {})](#deletemodel-options--)
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
  - [Creating classes](#creating-classes-5)
    - [Properties](#properties-5)
      - [attributes](#attributes)
      - [collection](#collection-1)
      - [id](#id)
  - [Usage](#usage-6)
  - [Methods](#methods-6)
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
  - [Usage](#usage-7)
  - [Creating classes](#creating-classes-6)
  - [Properties](#properties-6)
    - [collection](#collection-2)
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

firenze.js can be used in both node.js as well as the browser.

## Node.js

```
$ npm install --save firenze
```

Now you can require it as follows:

```js
var firenze = require('firenze');
```

## Browser

You can download firenze.js using [Bower](http://bower.io).

```js
$ bower install --save firenze
```

The package comes with multiple dist files, and you are free to choose whatever setup suits you best.

If you want to include just one file along with all the required dependencies:

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
var Post = f.createModel({
  getLowercasedTitle: function () {
    return this.get('title').toLowerCase();
  }
});

// define a Collection, which represents a table
var Posts = db.createCollection({
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

posts.find()
  .where({
    id: 1
  })
  .then(function (post) {
    // post in an instance of Model, with fetched data
    var title = post.get('title');

    // custom Model method
    var lowerCasedTitle = post.getLowercasedTitle();

    // or convert to plain object
    var postObject = post.toJSON();
    var title = postObject.title;
  });

// saving
var post = posts.model({
  title: 'Hello World',
  body: 'blah...'
});

post.save()
  .then(function (model) {
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
  user: 'root',
  password: '',
  pool: {
    min: 0,
    max: 1
  }
});
```
## Methods

### createCollection(extend)

Quickly create Collection class that references to current Database instance.

### getAdapter()

Returns adapter instance

### query()

Returns a new query builder of the Adapter

### schema()

Returns schema object for manipulating the Database

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

You would hardly ever need to create an instance of an Adapter. Database class would take care of it.

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

### closeConnection()

Closes the current connection.

Returns a promise.

### query()

Returns a new query object

### schema()

Returns Schema object

### populateTable(collection, rows)

Inserts rows into collection's table

Returns a promise

### loadFixture(collection, rows)

Drops and creates table, and loads data for given collection

Returns a promise.

### loadAllFixtures(arr)

Runs fixtures for multiple collections

`arr` should be in the format of `[{collection: posts, rows: rows}]`

Returns a promise.

<!--/docume:src/Adapter.js-->

<!--docume:src/Schema.js-->
## Schema

Schema class is responsible for exposing methods for manipulating the database, like dropping and creating tables.

It made its way into the project in v0.3, for abstracting the responsibilities of fixtures in tests mainly.

The class is intended to be primarily used by Adapters internally only.

### Creating classes

Unless you are building an adapter yourself, you wouldn't be required to create a Schema class.

Example in ES6:

```js
import {Schema} from 'firenze';

export default MyCustomSchema extends Schema {
  // ...
}
```

### Properties

#### adapter

Current instance of Adapter

### Methods

#### getConnection()

Returns current Adapter's connection

#### dropTable(collection)

Drops the table for given collection.

Returns a promise.

#### createTable(collection)

Create table from given collection.

Schema can build the table from the information available in `collection.schema`.

<!--/docume:src/Schema.js-->

<!--docume:src/Query.js-->
# Query

The query builder is the heart of all Adapters.

This class is responsible for building the query and executing it against the database.

## Usage

For helping understanding better, we will be showing examples with SQL environments below.

```js
// create a new Query object
var query = db.query()
  .select('id', 'title') // select the columns `id` and `title`
  .from('posts', 'Post') // from `posts` table, as `Post`
  .where({ // conditions
    id: 1
  })
  .orderBy({
    id: 'asc' // order by the column `id` in ascending order
  })
  .limit(10); // limit the results set to `10`

// execute it
query.run()
  .then(function (results) {
    console.log(results);
  });
```

Majority of the methods are chainable.

## Creating classes

Unless you are building an Adapter yourself, you wouldn't be required to create Query classes yourself.

Example in ES6:

```js
// base Query class
import {Query} from 'firenze';

// custom helper classes needed for creating new Query class
import FooExpression from './Expression';
import FooFunctions from './Functions';

export default class FooQuery extends Query {
  constructor(options = {}) {
    options = {
      expressionClass: FooExpression,
      functionsClass: FooFunctions,
      ...options
    };

    super(options);
  }
}
```

## Properties

### adapter

Current instance of Adapter

### collection

Current collection (if any)

## Methods

### setAdapter(adapter)

Sets adapter to given one

### getAdapter()

Returns currently set Adapter instance

### setCollection(collection)

Sets collection to given one

### expr()

Read more in Expression section.

Returns a new Expression object

### func()

Read more in Functions section.

Returns a new Functions object

### all()

Returns a promise, resolving with an array of results after execution

### first()

Returns a promise, resolving with with a single object result after execution

### run()

Returns a promise, with the direct result of execution

### toModels(results)

Converts results to model(s), if query is for a Collection

### toModel(result)

Alias to `.toModels()`

### tap(fn)

Taps into the query builder chain, so you can perform something in between.

Example:

```js
db.query()
  .select('id', 'title')
  .tap(function () {
    // `this` is the Query object here
  })
  .run()
```

<!--/docume:src/Query.js-->

<!--docume:src/adapters/Sql/makeQuery.js-->
### select()

Selects columns to be fetched.

Can be called in various ways.

#### Array

```js
query.select(['id', 'title']);
```

#### Arguments

```js
query.select('id', 'title');
```

#### Object

```js
query.select('id', {
  someTitle: 'title' //
}); // `SELECT id, title as someTitle`
```

#### Function

```js
query.select('id', function (column) {
  return column('title')
    .upper()
    .trim();
}); // `SELET id, TRIM(UPPER(title))`
```

Read more about column Functions in its own section.

### distinct(fields)

Selects DISTINCT columns given as an array

### from (table, alias = null)

Specify the table where to fetch results from

* `.from('users')` would result in `SELECT * FROM users`
* `.from('users', 'User')` would result in `SELECT * FROM users AS User`

### table(table)

Not all query operations are SELECTs, but still require setting a table.

`.table()` can be used in those scenarios.

### where()

Sets conditions to the Query object.

Conditions can be set in various ways. For e.g, the same query for finding results where `id = 1` can be written as follows:

**Plain object**:

```js
query.where({
  id: 1
});
```

**Function**:

```js
query.where(function (expr) {
  // `expr` is an Expression object here
  expr.eq('id', 1);
});
```

Read more about Expressions in its own section.

### andWhere()

Same as `.where()` but with `AND` operator

### orWhere()

Same as `.where()` but with `OR` operator

### notWhere()

Same as `.where()` but with `NOT` operator

### limit(number)

Limit query results

### page(number)

Call it only if `.limit()` was called before.

Paginates results to certain page.

### offset(number)

Offsets results. Do not use it together with `.page()`.

### orderBy(name, direction)

Accepts options in two ways:

**Arguments**

```js
query.orderBy('created', 'asc');
```

***Object**

```js
query.orderBy({
  created: 'asc'
});
```

### groupBy(column)

Groups results set by given column.

Can be a string or an array of columns.

### count()

Count the number of results

Example:

```js
query
  .from('users')
  .where({active: 1})
  .count()
  .run()
  .then(function (count) {
    // `count` is an integer here
  });
```

### create(row)

Insert a single or multiple objects into the table

### update(row)

Update with given row

### delete()

Delete records based on current Query conditions

### join(options)

Base method for joining tables.

For example, a LEFT join:

```js
query
  .select('*')
  .from('posts', 'Post')
  .join({
    type: 'LEFT',
    table: 'authors',
    alias: 'Author',
    on: function (expr) {
      expr.eq('Post.author_id', 'Author.id');
    }
  })
  .run()
```

There are also other handy methods for various kinds of JOINs

### innerJoin(options)

Wrapper for `INNER` join.

### leftJoin(options)

Wrapper for `LEFT` join.

### leftOuterJoin(options)

Wrapper for `LEFT OUTER` join.

### rightJoin(options)

Wrapper for `RIGHT` join.

### rightOuterJoin(options)

Wrapper for `RIGHT OUTER` join.

### outerJoin(options)

Wrapper for `OUTER` join.

### fullOuterJoin(options)

Wrapper for `FULL OUTER` join.

### debug()

Prints out the currently developed Query as a string in console

<!--/docume:src/adapters/Sql/makeQuery.js-->

<!--docume:src/Expression.js-->
## Expression

Expression class is responsible for handling all sorts of conditions that make up a Query object.

An instance of Expression object is passed into functions like `where()`, `andWhere()`, etc.

### Usage

```js
db.query()
  .from('posts')
  .where(function (expr) {
    // `expr` here in an Expression object
    expr
     .eq('author_id', 1)    // WHERE author_id = 1
     .notEq('published', 1) // AND published != 1
  })
  .run();
```

### Creating classes

Unless you are building an Adapter, you wouldn't be required to create an Expression class.

Example in ES6:

```js
import {Expression} from 'firenze';

export default class CustomExpression extends Expression {
  // ...
}
```

### Properties

#### query

Current query object

<!--/docume:src/Expression.js-->

<!--docume:src/adapters/Sql/Expression.js-->
#### eq(column, value)

Where column equals value.

#### notEq(column, value)

Where column doesn't equal to value.

#### lt(column, value)

Where column is less than value

#### lte(column, value)

Where column is less than or equal to value

#### gt(column, value)

Where column is greater than value

#### gte(column, value)

Where column is greater than or equal to value

#### like(column, value)

Where column is LIKE value.

Example:

```js
db.query()
  .from('posts')
  .where(function (expr) {
    expr.like('title', '%hello%'); // where `title` contains the text `hello`
  })
  .run();
```

#### notLike(column, value)

Where column is not LIKE value.

#### in(column, values)

Where column is one of the given values.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr.in('id', [1, 2, 3]); // where `id` is either 1, 2, or 3.
  });
```

#### notIn(column, values)

Where column is not one of the given values

#### isNull(column)

Where column is `null`

#### isNotNull(column)

Where column is not `null`

#### between(column, from, to)

Where column is between from and to.

Example:

```js
db.query()
  .from('posts')
  .where(function (expr) {
    expr.between('views_count', 1000, 2000); // where `views_count` is between 1000 and 2000
  })
  .run();
```
#### notBetween(column, from, to)

Where column is not between from and to.

#### and()

Nests further conditions with `AND` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .and(function (expr) {
        expr.eq('role_id', 2);
      });
  })
  .run();
```

#### or()

Nests further conditions with `OR` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .or(function (expr) {
        expr.eq('super_admin', 1);
      });
  })
  .run();
```

#### not()

Nests further conditions with `NOT` operator.

Example:

```js
db.query()
  .from('users')
  .where(function (expr) {
    expr
      .eq('active', 1)
      .not(function (expr) {
        expr.eq('spammer', 1);
      });
  })
  .run();
```

<!--/docume:src/adapters/Sql/Expression.js-->

<!--docume:src/Functions.js-->
## Functions

Functions class is an abstraction layer allowing you to perform database specific functions on columns.

### Usage

You can make use of functions from your Query object as follows:

```js
db.query()
  .from('posts')
  .select('id', function (column) {
    // `column` is in instance of `Functions` class here
    return column('title')
      .upper() // uppercase the `title` column
      .trim(); // and also trim the `title` column
  })
  .run();
```

You can also call it directly from the Query object if you already have it as a variable first:

```js
var query = db.query();

query
  .from('posts')
  .select('id', {
    title: query.func('title')
      .upper()
      .trim()
  })
  .run()
```

### Creating classes

Functions classes come from the Adapters. If you are building one yourself, you would optionally want to create one too.

Example in ES6:

```js
import {Functions} from 'firenze';

export default class CustomFunctions extends Functions {
  // ...
}
```

### Properties

#### query

The current query object

#### column

Currently chosen column name

### Methods

#### setColumn(column)

Set column name

<!--/docume:src/Functions.js-->

<!--docume:src/adapters/Sql/Functions.js-->
#### upper()

Apply `UPPER()` function to column

#### lower()

Apply `LOWER()` function to column

#### sum()

Apply `SUM()` function to column

#### avg()

Apply `AVG()` function to column

#### min()

Apply `MIN()` function to column

#### max()

Apply `MAX()` function to column

#### count()

Apply `COUNT()` function to column

#### now()

SQL equivalent of `NOW()`

#### year()

Apply `YEAR()` function to column

#### month()

Apply `MONTH()` function to column

#### day()

Apply `DAY()` function to column

#### week()

Apply `WEEK()` function to column

#### weekday()

Apply `WEEKDAY()` function to column

#### concat()

Apply `CONCAT()` function to column

Example:

```js
query.select({
  id_and_title: function (column) {
    return column.concat('id', JSON.stringify(' '), 'title');
  }
})
```

Now `id_and_title` field will be returned with `id` and `title` field's values separated by a space.

<!--/docume:src/adapters/Sql/Functions.js-->

<!--docume:src/Collection.js-->
# Collection

A collection represents a table. If you have a `posts` table, most likely you would have a collection for it called `Posts`.

## Creating classes

You can create a Collection class from your Database instance. And it requires minimum one property: `table`:

```js
var Posts = db.createCollection({
  table: 'posts',

  // optional
  modelClass: Post
});
```

You can also create a Collection class independently:

```js
var Posts = f.createCollection({
  db: db, // instance of your Database

  table: 'posts'
});
```

### Properties

#### modelClass

Every collection requires a Model for representing its records. This property directly references to the Model class.

Be defalult, it is set to the base Model class, which you can always override.

#### table

The name of the table that this Collection represents. Always as a string.

#### schema

Collections do not necessarily need to define their full schema, but you would need them for building fixtures (for tests) and also assigning validation rules, for e.g., later.

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

You can also use the `schema` property to set validation rules.

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

See Validations section later for more documentation on this.

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

#### alias

Unless defined, alias always defaults to the `table` property. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.

If you have a `Posts` collection for the table `posts`, with a model `Post`, it is safe to have an alias `Post` (in singular form).

## Usage

Before using the Collection, you need to create an instance of it:

```js
var posts = new Posts();
```

## Validations

Validation rules for fields can be set when defining the schema:

### Single rule

```js
db.createCollection({
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

### Asynchronous rule

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

By default, all the validation rules from [Validator.js](https://github.com/chriso/validator.js#validators) are available:

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
db.createCollection({
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
var Posts = db.createCollection({
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
        required: true, // here
        message: 'Must be alphabets only'
      }
    }
  }
});
```

## Methods

### model(attributes = {}, extend = {})

Get a new instance of this Collection's model

### getDatabase()

Get an instance of the current Collection's Database

### setDatabase(db)

Change database instance of this Collection to `db`

### getAdapter()

Get adapter of the Collection's database

### query()

Get a new query builder for this Collection's table

### find()

Returns query builder for fetching records of this Collection.

Example:

```js
var posts = new Posts();
var query = posts.find();

query
  .where({id: 1})
  .first() // could also be `.all()` for returning multiple results
  .then(function (post) {
    var title = post.get('title');
  });
```

See Query section of the documentation for more usage details.

### findBy(field, value)

Shortcut method for finding single record that matches a field's value.

Returns a promise with the found model.

### findAllBy(field, value)

Shortcut method for finding all records that matches a field's value.

Returns a promise.

### findById(value)

Shortcut method for finding a record by its ID.

Returns a promise.

### findByKey(value)

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

### delete(model, options = {})

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

var Posts = f.createCollection({
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

A model represents a record of a table. If you have a `posts` table, most likely you would want to name your Model class in its singular form, which is `Post`.

## Creating classes

You can create a Model class as follows:

```js
var Post = f.createModel({
  // ...
});
```

If you are using ES6:

```js
import {Model} from 'firenze';

class Post extends Model {
  // ...
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

Fetches the model from the Database, and returns it with a promise.

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
var Posts = db.createCollection({
  behaviors: [
    TimestampBehavior,
    AnotherBehavior
  ]
});
```

With custom configuration:

```js
var Posts = db.createCollection({
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

var TimestampBehavior = f.createBehavior({
  beforeSave: function (model) {
    model.set('created', new Date());
    return new f.Promise(true);
  }
});
```

If you are using ES6, the syntax can be much simpler:

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

* v0.2.1
  * Fix for updating records
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
  * `npm run test`
  * `npm run dist`
* Commit the changes.
* Run `npm publish .`
* Tag the repository with `vX.X.X`
* Update GitHub Pages.

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
