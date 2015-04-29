var lib = require('../index');
var config = require('./config');
var fixturize = require('./common/fixturize');

var db = new lib.Database(config.mysql);

// test
var Post = require('./models/Post')(db);
var postsFixtures = require('./fixtures/posts');
var post = new Post();

fixturize(post, postsFixtures).then(function (results) {
  console.log('results', results);
}).catch(function (error) {
  console.log('error', error);
});
