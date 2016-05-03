# Associations

Linking collections together, by defining their relationships is very straighforward in firenze.js.

As of this moment, these relationships are supported by core:

* `one to one` (e.g., A user has one profile)
* `one to many` (e.g., A post has many comments)
* `many to one` (e.g., Many posts belong to a user)

Given the flexibility firenze.js provides in its architecture, adapters are able to fully take over and roll their own new association types if needed.

## Defining relationships

Relationships are defined at Collection level.

For example, if you have two Collections `Users` and `Profiles`, you can associate them as follows:

```js
// ./collections/Users.js
var db = require('../config/db');

var Profiles = require('./Profiles');

module.exports = db.createCollection({
  table: 'users',

  alias: 'User',

  profile: function () {
    return this.association()
      // the relationship type
      .oneToOne(Profiles)

      // link the table columns
      .joinColumn('User.id', 'Profile.id')

      // make and return the associated Profile collection's instance
      .collection();
  }
});
```

## Circular/cyclic dependencies

It would be very common to get into a situation, where you would define associations between Collections from both sides, and then you end up with circular dependency issue.

firenze.js has you covered here, when you are developing for Node.js environments. You can decide to only pass the path to the Collection module when defining, and the library would take care of `require()`ing it itself:

```js
// ./collections/Users.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'users',

  profile: function () {
    return this.association()
      .oneToOne(__dirname + '/Profiles') // path passed as a string
      .joinColumn('User.id', 'Profile.id')
      .collection();
  }
});
```

An alternative solution would be to `require()` the association collection from inside the method:

```js
// ./collections/Users.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'users',

  profile: function () {
    var Profiles = require('./Profiles');

    return this.association()
      .oneToOne(Profiles)
      .joinColumn('User.id', 'Profile.id')
      .collection();
  }
});
```

## Fetching with associated data

If User has a Profile, and you want to include Profile data when fetching Users, you can do as follows:

```js
var Users = require('./collections/Users');

var users = new Users();

users.find()
  .where({active: 1})
  .include(['profile'])
  .first()
  .then(function (user) {
    // user is a model
    var name = user.get('name'); // John Smith

    var profile = user.get('profile'); // model
    var url = profile.get('url'); // http://example.com
  });
```

## Accessing associated collections

When you have an instance of `Users` collection, you can get its associated collections' instance as follows:

```js
var users = new Users();

var profiles = users.profile(); // instance of Profiles collection
```

## Examples of possible association types

### one to one

User has one Profile:

```js
// ./collections/Users.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'users',

  profile: function () {
    return this.association()
      .oneToOne(__dirname + '/Profiles')
      .joinColumn('User.id', 'Profile.id')
      .collection();
  }
});
```

### one to many

Post has many Comments:

```js
// ./collections/Posts.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'posts',

  comments: function () {
    return this.association()
      .oneToMany(__dirname + '/Comments')
      .joinColumn('Post.id', 'Comment.post_id')
      .collection();
  }
});
```

### many to one

Book belongs to Author:

```js
// ./collections/Books.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'books',

  author: function () {
    return this.association()
      .manyToOne(__dirname + '/Authors')
      .joinColumn('Book.author_id', 'Author.id')
      .collection();
  }
});
```
