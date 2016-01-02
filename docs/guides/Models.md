# Models

Models represent a single item/record of a Collection.

Creating separate classes for Models are optional. Only create them if you want to expose some methods on fetched rows.

## Naming Convention

Ideally, Models are named after a Collection's alias. From our examples before, our `Posts` Collection, will have a model named `Post`.

## Defining a Model

We will create a Model file at `./models/Post.js`:

```js
// ./models/Post.js
var f = require('firenze');

module.exports = f.createModel({
  lengthOfTitle: function () {
    return this.get('title').length;
  }
});
```

It's usage will be clear when we discuss [Fetching Data](./FetchingData.md).

## Connect it to Collection

We also need to let our Collection know to use the newly created Model class when serving records:

```js
// ./collections/Posts.js
var db = require('../config/db');
var Post = require('../models/Post');

module.exports = db.createCollection({
  table: 'posts',

  modelClass: Post
});
```
