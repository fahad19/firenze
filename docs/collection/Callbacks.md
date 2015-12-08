# Collection Lifecycle Callbacks

Collections support callbacks that you can define when creating classes.

For example:

```js
var Promise = f.Promise;

var Posts = f.createCollection({
  alias: 'Post',

  beforeSave: function (model) {
    // do something before saving...

    // end the callback with a promise
    return new Promise.resolve(true);
  }
});
```

### modelInitialize(model)

Called right after Collection's Model construction.

For synchronous operations only, since it does not return any Promise.

### beforeSave(model)

Should return a Promise with `true` to continue.

To stop the save, return a Promise with an error.

### afterSave(model)

Should return a Promise.

### beforeValidate(model)

Should return a Promise with `true` to continue.

To stop the validation, return a Promise with an error.

### afterValidate(model)

Should return a Promise.

### beforeDelete(model)

Should return a Promise with `true` to continue.

To stop from deleting, return a Promise with an error.

### afterDelete(model)

Should return a Promise.
