var should = require('should');
var lib = require('../../index');
var config = require('../config');

describe('Collection', function () {
  before(function () {
    this.db = new lib.Database(config.mysql);
    this.Posts = require('../collections/Posts')(this.db);
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should have an instance', function () {
    var posts = new this.Posts();
    posts.should.have.property('table').which.is.exactly('posts');
  });

  it('should have a model', function () {
    var posts = new this.Posts();
    posts.should.have.property('model');

    var post = posts.model();
    post.should.have.property('alias').which.is.exactly('Post');
  });
});