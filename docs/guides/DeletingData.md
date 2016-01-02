# Deleting Data

Records can be deleted from Model-level.

```js
// ./index.js
var Posts = require('./collections/Posts');
var posts = new posts();

var post = posts.model({id: 1});

post.delete()
  .then(function () {
    // successfully deleted
  })
  .catch(function () {
    // couldn't delete, an error occurred
  });
```
