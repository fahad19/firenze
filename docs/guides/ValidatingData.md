# Validating Data

We have seen before how to define validation per field in Collections. You can see them more in depth [here](../collection/Validation.html).

## Validate a single field

```js
var Posts = require('../collections/Posts');
var posts = new Posts();

// create new Model
var post = posts.model({
  title: 'Hello World',
  body: 'blah...'
});

// validate a single field
post.validateField('title')
  .then(function () {
    // validated successfully
  })
  .catch(function (error) {
    console.log('Could not validated:', error);
  });
```

## Validate the whole Model

```js
post.validate()
  .then(function () {
    // all good
  })
  .catch(function (error) {
    // if one (or more) fields failed to validate.

    // `error` will be a plain object here, keyed by field names,
    // with list of error messages as arrays as their values.
  })
```

## Validate while saving Model

When you save Model, validation automatically kicks in, and will prevent from saving if it fails.

```js
post.save()
  .then(function (model) {
    // saved successfully
  })
  .catch(function (error) {
    if (error.validationErrors) {
      // validation error

      return;
    }

    // some other error
  }
  })
```
