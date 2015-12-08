# Collection Methods

### model(attributes = {}, extend = {})

Get a new instance of this Collection's model

### getDatabase()

Get an instance of the current Collection's Database

### setDatabase(db)

Change database instance of this Collection to `db`

### getAdapter()

Get adapter of the Collection's database

### query()

Get a new query builder for this Collection's table

### find()

Returns query builder for fetching records of this Collection.

Example:

```js
var posts = new Posts();
var query = posts.find();

query
  .where({id: 1})
  .first() // could also be `.all()` for returning multiple results
  .then(function (post) {
    var title = post.get('title');
  });
```

See Query section of the documentation for more usage details.

### findBy(field, value)

Shortcut method for finding single record that matches a field's value.

Returns a promise with the found model.

### findAllBy(field, value)

Shortcut method for finding all records that matches a field's value.

Returns a promise.

### findById(value)

Shortcut method for finding a record by its ID.

Returns a promise.

### findByKey(value)

Alias for `collection.findById()`.

Returns a promise.

### validate()

Validates all fields of the given Model

Returns a promise with `true` if all validated, otherwise an object of error messages keyed by field names.

@TODO: `reject()` instead on error?

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### validateField(model, field, value = null)

Validates a single field

Returns a promise with true if validated, otherwise error message

### save(model, options = {})

Save the given model. This method is not usually called directly, but rather via `Model.save()`.

Returns a promise with model instance.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### delete(model, options = {})

Deletes the given model. Usually called via `Model.delete()`.

Returns a promise.

Options:

* `callbacks`: Defaults to true, pass false to disable before/after callbacks.

### loadBehaviors()

Called during construction, and loads behaviors as defined in `behaviors` property.

### callBehavedMethod(methodName)

Used internally to call a callback method along with all the methods defined by loaded Behaviors too.
