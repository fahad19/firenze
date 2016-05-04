# Association Methods

### oneToOne(Collection)

One to one relationship, accepting a related Collection class.

### oneToMany(Collection)

One to many relationship, accepting a related Collection class.

### manyToOne(Collection)

Many to one relationship, accepting a related Collection class.

### type(type, Collection)

Shorthand for relationship type methods. For example, the `oneToOne` method is implemented like this:

```js
oneToOne(Collection) {
  return this.type('oneToOne', Collection);
}
```

### joinColumn(column, referencedColumn)

The `column` of the current Collection, and the connected `referencedColumn` of the target Collection.

Example:

```js
// ./collections/Users.js
var db = require('../config/db');

module.exports = db.createCollection({
  table: 'users',

  profile: function () {
    var Profiles = require('./Profiles');

    return this.association()
      .oneToOne(Profiles)
      .joinColumn('User.id', 'Profile.id') // column and referencedColumn
      .collection();
  }
});
```

### orderBy(...args)

If any ordering is set, then it will be fed to the query builder when fetching related data.

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
      .orderBy({'Profile.id': 'asc'}) // ORDER BY Profile.id ASC
      .collection();
  }
});
```

### limit(limit)

If any limit is set, then it will be fed to the query builder when fetching related data.

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
      .limit(5) // limit to 5 max results
      .collection();
  }
});
```

### collection(options = {})

When defining the association, we end the chain by calling `.collection()`, so that we return an instance of the target Collection based on the configuration we have been accumulating.

`options` are passed to the target Collection's constructor.

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
      .collection(); // this line returns an instance of Profiles collection
  }
});
```

### getParentAssociationOptions()

Returns the Collection's association configuration if used from a parent Collection.

### fetchIncludes(model, includes)

Goes through the `includes` array, and is responsible for fetching and injecting related data into the `model`.

Returns a Promise, resolving with updated `model`.

### fetchInclude(model, include)

Is called by the method above, and is responsible for fetching a single related Collection's data, and then injecting it into the `model`.

Returns a Promise, with modified `model`.
