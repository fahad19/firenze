# Column Types

Documentation below reflects SQL adapters.

When defining schema at Collection.schema, or passing it to Schema.createTable(), we define the type of the field/column.

There are various supported column types as of this moment.

## Available Types

* increments
* integer
* bigInteger
* text
  * `textType`: `mediumtext` or `longtext`
* string
  * `length`
* float
  * `precision`
  * `scale`
* decimal
  * `precision`
  * `scale`
* boolean
* date
* dateTime
* time
* timestamp
  * `standard`
* binary
  * `length`
* enum
  * `values`: array of values
* json
* uuid

Child items represent the additional keys that can be passed to schema for them.

### Usage

```js
db.schema()
  .createTable('posts', {
    id: {
      type: 'uuid'
    },
    title: {
      type: 'string'
    }
  });
```

## Options

Some columns can also have additional information about them.

For example, `string` type can also have a specified length:

```js
db.schema()
  .createTable('posts', {
    title: {
      type: 'string',
      length: 100
    }
  });
```

Other common options include:

* `primary`: boolean
* `unique`: boolean
* `nullable`: boolean
* `default`: default value
* `unsigned`: boolean
* `comment`: comment for the column

### Usage

```js
db.schema()
  .createTable('posts', {
    title: {
      type: 'string',
      length: 100,
      nullable: true
    }
  });
```
