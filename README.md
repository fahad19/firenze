# firenze

Node.js ORM for MySQL.

# Usage

```js
var firenze = require('firence');

var connection = new firenze.Connection({
  host: '',
  database: '',
  user: '',
  password: ''
});

var Posts = new firenze.Collection({
  connection: connection,

  table: 'posts',

  model: function () {
    return new Post();
  }
});

var Post = new firenze.Model({
  alias: 'Post',

  primaryKey: 'id',

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
```

## License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
