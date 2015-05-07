# firenze

Node.js ORM for MySQL.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Quickstart](#quickstart)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Quickstart

Install the module first:

```
$ npm install --save firenze
```

Now you can proceed to managing your database as folllows:

```js
var f = require('firenze');
var Database = f.Database;

// create an instance of your Database
var db = new Database({
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

# License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
