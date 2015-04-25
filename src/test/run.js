var lib = require('../index');
var config = require('./config');
var fixturize = require('./common/fixturize');

var db = new lib.Database(config.mysql);

// test
var Post = require('./models/Post');
var post = new Post();
var posts = require('./fixtures/posts');

fixturize(post, posts);
