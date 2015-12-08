# Behavior Usage

```js
var Posts = db.createCollection({
  behaviors: [
    TimestampBehavior,
    AnotherBehavior
  ]
});
```

With custom configuration:

```js
var Posts = db.createCollection({
  behaviors: [
    {
      'class': TimestampBehavior,
      options: {
        timezone: 'UTC'
      }
    },
    AnotherBehavior
  ]
});
```
