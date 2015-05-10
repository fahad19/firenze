# firenze

Node.js ORM for MySQL.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Quickstart](#quickstart)
- [Database](#database)
- [Collection](#collection)
  - [Creating classes](#creating-classes)
    - [Properties](#properties)
      - [table](#table)
      - [modelClass](#modelclass)
  - [Usage](#usage)
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
  - [Methods](#methods)
    - [model(attributes = {}, extend = {})](#modelattributes---extend--)
    - [database()](#database)
    - [setDatabase(db)](#setdatabasedb)
    - [getQuery(options = {})](#getqueryoptions--)
    - [find()](#find)
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
  - [Usage](#usage-1)
  - [Methods](#methods-1)
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
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quickstart

Install the module first:

```
$ npm install --save firenze mysql
```

Now you can proceed to managing your database as folllows:

```js
var f = require('firenze');
var Database = f.Database;

// create an instance of your Database
var db = new Database({
  type: 'mysql',
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

```js
var f = require('firenze');
var Database = f.Database;

var db = new Database({
  type: 'mysql',
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

#### table

The name of the table that this Collection represents. Always as a string.

#### modelClass

Every collection requires a Model for representing its records. This property can directly reference to the Model class, or it can be a function that returns the Model class.

## Usage

Before using the Collection, you need to create an instance of it:

```js
var posts = new Posts();
```

### Finders

There are various ways you can find results:

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

## Methods

### model(attributes = {}, extend = {})

Get an instance of this Collection's model

### database()

Get in instance of the current Database

### setDatabase(db)

Change database instance of this Collection to `db`

### getQuery(options = {})

Get query object for this Collection

### find()

Explained above in `Finders` section

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
    type: 'increments'
  },
  title {
    type: 'string'
  }
}
```

List of available column types:

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

<!--/docume:src/Model.js-->

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
