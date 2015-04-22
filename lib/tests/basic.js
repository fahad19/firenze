'use strict';

var lib = require('../index');

var db = new lib.Database({
  type: 'mysql',
  host: '127.0.0.1',
  database: 'firenze',
  user: 'root',
  password: '' });

var q = db.connection().select().table('test_posts').then(function (posts) {
  console.log(posts);
});

console.log('hello');