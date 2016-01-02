# Saving Data

Data can be saved from Model level.

## Creating a new record

```js
// ./index.js
var Posts = require('../collections/Posts');
var posts = new Posts();

// create a new Model
var post = posts.model({
  title: 'Hello World'
});

// now save it
post.save()
  .then(function (model) {
    // successfully saved
    var id = model.get('id');

    console.log('Created new post with ID:', id);
  });
```

## Updating an existing record

```js
var post = posts.model({id: 1});

post.set('title', 'Hello World [updated]');

post.save()
  .then(function (model) {
    // sucessfully updated
    var title = model.get('title'); // `Hello World [updated]`
  });
```
