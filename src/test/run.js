var async = require('async');

var lib = require('../index');
var config = require('./config');
var fixturize = require('./common/fixturize');

var db = new lib.Database(config.mysql);

// test
var Post = require('./models/Post')(db);
var Author = require('./models/Author')(db);

var fixtures = [
  {
    model: new Post(),
    data: require('./fixtures/posts')
  },
  {
    model: new Author(),
    data: require('./fixtures/authors')
  }
];

async.map(fixtures, function (fixture, callback) {
  fixturize(fixture.model, fixture.data).then(function (results) {
    callback(null, results);
  }).catch(function (error) {
    callback(error);
  });
}, function (err, results) {
  if (err) {
    throw err;
  }

  console.log('all fixtures ran successfully', results);
});


