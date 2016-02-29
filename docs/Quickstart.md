# Quickstart

The example targets Node.js environment.

## Install

Install the module (along with an adapter) first:

```
$ npm install --save firenze firenze-adapter-mysql
```

## Require the modules

```js
var f = require('firenze');
var Database = f.Database;
var MysqlAdapter = require('firenze-adapter-mysql');
```

## Create an instance of your Database

```js
var db = new Database({
  adapter: MysqlAdapter,
  host: '127.0.0.1',
  database: 'my_database',
  user: '',
  password: ''
});
```

## Define a Model

Which represents a record:

```js
var Post = f.createModel({
  getLowercasedTitle: function () {
    return this.get('title').toLowerCase();
  }
});
```

## Define a Collection

Which represents a table:

```js
var Posts = db.createCollection({
  table: 'posts',

  alias: 'Post',

  modelClass: Post, // overriding Model class is optional

  // defining schema is optional
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
```

## Get an instance of Collection

```js
var posts = new Posts();
```

## Finding

```js
posts.find()
  .where({
    id: 1
  })
  .first()
  .then(function (post) {
    // post in an instance of Model, with fetched data
    var title = post.get('title');

    // custom Model method
    var lowerCasedTitle = post.getLowercasedTitle();

    // or convert to plain object
    var postObject = post.toJSON();
    var title = postObject.title;
  });
```

## Saving

```js
var post = posts.model({
  title: 'Hello World',
  body: 'blah...'
});

post.save()
  .then(function (model) {
    console.log('Saved with ID: ' + model.get('id'));
  });
```

## Deleting

```js
var post = posts.model({id: 1});

post.delete()
  .then(function () {
    console.log('deleted');
  });
```
