# Collection Properties

### modelClass

Every collection requires a Model for representing its records. This property directly references to the Model class.

Be defalult, it is set to the base Model class, which you can always override.

### table

The name of the table that this Collection represents. Always as a string.

### schema

Collections do not necessarily need to define their full schema, but you would need them for building fixtures (for tests) and also assigning validation rules, for e.g., later.

The keys of this object are the column names, and the value defines what type of column they are. For example:

```js
{
  id: {
    type: 'integer'
  },
  title: {
    type: 'string'
  }
}
```

Column types can vary depending on the adapter you are using.

You can also use the `schema` property to set validation rules.

For example:

```js
{
  email: {
    type: 'string',
    validate: {
      rule: 'isEmail',
      message: 'Please enter a valid email address'
    }
  }
}
```

Validations will be discussed further later in its own section.

### primaryKey

The name of the ID field, defaults to `id`.

### displayField

This is the field that represents your record's display value. Usually `title` or `name` in most cases.

### validationRules

Define rules logic which can be used for various fields.

Example:

```js
{
  ruleName: function (field, value) {
    return true;
  },
  asyncRule: function (value, field, done) {
    return done(true);
  },
  ruleWithOptions: function (value, field, arg1, arg2) {
    return true;
  }
}
```

See Validations section later for more documentation on this.

### behaviors

Array of behavior classes, in the order as you want them applied.

Example:

```js
[
  TimestampBehavior,
  AnotherCustomBehavior
]
```

### loadedBehaviors

Array of already loaded behaviors for this model

### alias

Unless defined, alias always defaults to the `table` property. When associations get in the way, having a unique alias helps avoiding ambiguity when constructing complex conditions.

If you have a `Posts` collection for the table `posts`, with a model `Post`, it is safe to have an alias `Post` (in singular form).
