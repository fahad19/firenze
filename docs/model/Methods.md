# Model Methods

### get(field)

Get the field of current model

### set(field, value)

Set an attribute with given value for the field

### toObject()

Returns a plain object of the model

### toJSON()

Alias of `.toObject()`.

### fetch(options = {})

Fetches the model from the Database, and returns it with a promise.

A quick example:

```js
var post = posts.model({id: 1});

post.fetch().then(function (model) {
  var title = model.get('title');
});
```

Returns a promise.

### getId()

Get the ID of model

### isNew()

Is the current model new? As in saved in Database, or yet to be saved?

### save(options = {})

Save the current model, and returns a promise.

Calls `Collection.save()`.

Returns a promise.

### saveField(field, value)

Save a particular field with value.

Returns a promise.

### clear()

Clear the current instance of model of any data

### delete(options = {})

Delete the current model, and return a promise.

Calls `Collection.delete()`

### validate()

Validates all fields of the current Model

Calls `Collection.validate()`

### validateField(field, value = null)

Validates a single field

Calls `Collection.validateField()`

Returns a promise

### transact(t)

Returns self for further chaining.

Read more in [Transaction](../transaction) section.

### resetTransact()

Resets any reference to transaction.

Returns self for further chaining.
