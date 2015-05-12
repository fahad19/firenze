# firenze

Node.js ORM for MySQL.

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
- [Collection](#collection)
  - [Creating classes](#creating-classes)
    - [Properties](#properties)
      - [modelClass](#modelclass)
      - [table](#table)
      - [finders](#finders)
  - [Usage](#usage-1)
  - [Methods](#methods-1)
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
      - [alias](#alias)
  - [Usage](#usage-2)
  - [Methods](#methods-2)
    - [collection(options = {})](#collectionoptions--)
    - [get(field)](#getfield)
    - [set(field, value)](#setfield-value)
    - [toObject()](#toobject)
    - [fetch(options = {})](#fetchoptions--)
    - [getId()](#getid)
    - [isNew()](#isnew)
    - [save(options = {})](#saveoptions--)
    - [saveField(field, value)](#savefieldfield-value)
    - [clear()](#clear)
    - [delete()](#delete)
    - [fixturify(rows)](#fixturifyrows)
- [Adapter](#adapter)
  - [Available](#available)
  - [Usage](#usage-3)
  - [Methods](#methods-3)
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
  - [MySQL Adapter](#mysql-adapter)
    - [Install](#install)
    - [Usage](#usage-4)
    - [Schema](#schema)
    - [Finders](#finders)
      - [first](#first)
      - [all](#all)
      - [list](#list)
      - [count](#count)
    - [Complex conditions](#complex-conditions)
      - [equals](#equals)
      - [in list](#in-list)
      - [comparisons](#comparisons)
      - [AND](#and)
      - [OR](#or)
      - [NOT](#not)
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

Explained above in `Finders` section

### findAll(options = {})

Returns an array of matched models

### findFirst(options = {})

Returns matched model if any

### findCount(options = {})

Returns count of matched results

### findList(options = {})

Returns key/value pair of matched results

### save(model, options = {})

Save the given model. This method is not usually called directly, but rather via `Model.save()`.

### delete(model)

Deletes the given model. Usually called via `Model.delete()`.

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
  title {
    type: 'string'
  }
}
```

Column types can vary depending on the adapter you are using.

#### attributes

Your model's data

#### primaryKey

The name of the ID field, defaults to `id`.

#### displayField

This is the field that represents your record's display value. Usually `title` or `name` in most cases.

#### id

For convenience, stores the ID of the model in this property

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

## Methods

### collection(options = {})

Get the model's Collection's instance

### get(field)

Get the field of current model

### set(field, value)

Set an attribute with given value for the field

### toObject()

Returns a plain object of the model

### fetch(options = {})

Fetches the model again from the Database.

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

Save the current model

### saveField(field, value)

Save a particular field with value

### clear()

Clear the current instance of model of any data

### delete()

Delete the current model

### fixturify(rows)

Drop, create, and populate table with data

<!--/docume:src/Model.js-->

<!--docume:src/Adapter.js-->
# Adapter

Adapter is responsible for making the actual database operations.

## Available

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

<!--docume:src/adapters/Mysql.js-->
## MySQL Adapter

MySQL adapter for Firenze.js

### Install

```
$ npm install --save firenze-adapter-mysql
```

### Usage

You aren't expected to deal with the Adapter directly. Just pass the adapter to Database config when you create an instance.

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

### Schema

When defining a Model's schema, you need to pass option for each column's `type`.

Here are the supported types from this adapter:

* increments
* integer
* bigInteger
* text
* string
* float
* decimal
* boolean
* date
* dateTime
* time
* enum
* binary
* uuid

Example:

```js
var Post = db.createModelClass({
  schema: {
    id: {
      type: 'increments'
    }
  }
});
```

### Finders

Examples below assumes you have an instance of Collection already:

```js
var posts = new Posts();
```

#### first

Gives you the first matched result:

```js
posts.find('first', {
  conditions: {
    id: 1
  }
}).then(function (post) {
  // post is now an instance of Post model
  var title = post.get('title');
});
```

#### all

Gives you all matched results:

```js
posts.find('all', {
  conditions: {
    published: true
  }
}).then(function (models) {
  models.forEach(function (model) {
    var title = model.get('title');
  });
});
```
#### list

Gives you a list of key/value paired object of matched results:

```js
posts.find('list', {
  conditions: {},
  fields: [
    'id',
    'title'
  ]
}).then(function (list) {
  // list is now:
  //
  // {
  //   1: 'Hello World',
  //   2: 'About'
  // }
});
```

#### count

Gives you the total count of matched results:

```js
posts.find('count').then(function (count) {
  // count is an integer here
});
```

### Complex conditions

#### equals

```js
posts.find('all', {
  conditions: {
    id: 1
  }
});
```

#### in list

```js
posts.find('all', {
  conditions: {
    id: [
      1,
      2,
      3
    ]
  }
});
```

#### comparisons

```js
posts.find('all', {
  conditions: {
    'Post.rating >': 3
  }
})
```

Example comparisons that you can try:

* greater than `ModelAlias.field >`
* greater than or equel to `ModelAlias.field >=`
* less than `ModelAlias.field <`
* less than or equal to `ModelAlias.field <=`
* not equal to `ModelAlias.field !=`

#### AND

```js
posts.find('all', {
  conditions: {
    AND: {
      'Post.published': 1
    }
  }
});
```

#### OR

```js
posts.find('all', {
  conditions: {
    OR: {
      'Post.published': 1
    }
  }
});
```

#### NOT

```js
posts.find('all', {
  conditions: {
    NOT: {
      'Post.published': 1
    }
  }
});
```

<!--/docume:src/adapters/Mysql.js-->

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
