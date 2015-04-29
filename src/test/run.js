var async = require('async');

var lib = require('../index');
var config = require('./config');
var fixtures = require('../common/fixtures');

// test
var db = new lib.Database(config.mysql);
var Post = require('./models/Post')(db);
var Author = require('./models/Author')(db);

fixtures.loadAll([
  {
    model: new Post(),
    data: require('./fixtures/posts')
  },
  {
    model: new Author(),
    data: require('./fixtures/authors')
  }
]).then(function (results) {
  console.log('fixtures loaded');
});
