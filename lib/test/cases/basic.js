'use strict';

var lib = require('../index');

var db = new lib.Database({
  type: 'mysql',
  host: '127.0.0.1',
  database: 'firenze',
  user: 'root',
  password: '' });

var q = db.connection().select().table('posts as Post').where({
  'Post.title': 'Hello World'
}).then(function (posts) {
  console.log(posts);
});

console.log('hello');