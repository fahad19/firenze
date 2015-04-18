# firenze

Node.js ORM for MySQL.

# Usage

```js
var firenze = require('firenze');

var db = firenze.Database({
  host: '',
  database: '',
  user: '',
  password: ''
});

// db.use('database_name')

var Posts = db.Collection({
  table: 'posts',

  modelClass: function () {
    return Post;
  }, // or modelClass: Post

  model: function () {
    var Model;
    if (_.isFunction(this.modelClass)) {
      Model = this.modelClass();
    } else {
      Model = this.modelClass;
    }

    return new Model();
  }
});

var Post = db.Model({
  alias: 'Post',

  primaryKey: 'id',

  collectionClass: Posts

  collection: function () {
    return new Posts();
  },

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

// saving
var post = new Post({
  title: 'Hello World',
  body: 'blah...'
});
var promise = post.save();
promise.then(function (post) {

}).catch(function (err) {

});

// finding
var posts = new Posts();
var promise = posts.find('first', {
  conditions: {
    id: 1
  }
});
promise.then(function (post) {

}).catch(function (err) {

});

// posts.use(anotherDb);
```

## License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
