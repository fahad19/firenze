# firenze

Node.js ORM for MySQL.

# Usage

```js
var Model = require('firenze').Model;
var Connection = require('firenze').Connection;

var connection = new Connection({
  host: '',
  database: '',
  user: '',
  password: ''
});

var Post = new Model({
  connection: connection,

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
var promise = Post.find('one', {
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
