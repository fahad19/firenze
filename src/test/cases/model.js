var should = require('should');
var lib = require('../../index');
var config = require('../config');

describe('Model', function () {
  before(function () {
    this.db = new lib.Database(config.mysql);
    this.Post = require('../models/Post')(this.db);
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should have an instance', function () {
    var post = new this.Post();
    post.should.have.property('alias').which.is.exactly('Post');
  });

  it('should have a collection', function () {
    var post = new this.Post();
    post.should.have.property('collection');

    var posts = post.collection();
    posts.should.have.property('table').which.is.exactly('posts');
  });
});
