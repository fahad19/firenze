# Association Usage

## Relationship types

By firenze.js core, there are 3 types of associations supported:

* `one to one`
* `one to many`
* `many to one`

### one to one

User has one Profile.

```js
// ./collections/Users.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'users',

  profile: function () {
    var Profiles = require('./collections/Profiles');

    return this.association() // the Association instance

      // define the relationship type
      .oneToOne(Profiles)

      // link the table columns
      .joinColumn('User.id', 'Profile.id')

      // make and return the Profiles collection instance
      .collection();
  }
});
```

### one to many

Author has many Books.

```js
// ./collections/Authors.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'authors',

  books: function () {
    var Books = require('./collections/Books');

    return this.association()
      .oneToMany(Books)
      .joinColumn('Author.id', 'Book.author_id')
      .collection();
  }
});
```

### many to one

Comment belongs to Post.

```js
// ./collections/Comments.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'comments',

  books: function () {
    var Posts = require('./collections/Posts');

    return this.association()
      .oneToMany(Posts)
      .joinColumn('Comment.post_id', 'Post.id')
      .collection();
  }
});
```

## Fetching linked data

Fetching a User, with its Profile:

```js
var Users = require('./collections/Users');
var users = new Users();

users.find()
  .where({id: 1})
  .include(['profile']) // pass an array of association keys
  .then(function (user) {
    var name = user.get('name'); // John Smith

    var profile = user.get('profile');
    var url = profile.get('url'); // http://example.com
  });
```

## Ordering and limiting related fetched data

We can define the sorting and limit of data to fetch while defining the association.

Author has many Books:

```js
// ./collections/Authors.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'authors',

  books: function () {
    var Books = require('./Books');

    return this.association()
      .oneToMany(Books)
      .joinColumn('Author.id', 'Book.author_id')
      .orderBy({id: 'asc'}) // ORDER BY `id` asc
      .limit(5) // limit to 5 books max when fetching Author
      .collection();
  }
});
```
