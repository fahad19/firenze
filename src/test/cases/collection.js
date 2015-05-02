var should = require('should');
var lib = require('../../index');
var config = require('../config');

describe('Collection', function () {
  before(function (done) {
    this.db = new lib.Database(config.mysql);
    this.Posts = require('../collections/Posts')(this.db);
    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    lib.fixtures.loadAll([
      {
        model: new this.Post(),
        data: this.postsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw err;
    });
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

  it('should find all results', function (done) {
    var posts = new this.Posts();
    posts.find('all').then(function (posts) {
      posts.should.be.instanceOf(Array);
      posts.should.have.lengthOf(3);

      var firstPost = posts[0];
      firstPost.should.have.property('attributes');
      firstPost.attributes.title.should.be.exactly('Hello World');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result', function (done) {
    var posts = new this.Posts();
    posts.find('first', {
      conditions: {
        id: 1
      }
    }).then(function (post) {
      post.get('title').should.equal('Hello World');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result with aliased conditions', function (done) {
    var posts = new this.Posts();
    posts.find('first', {
      conditions: {
        'Post.id': 2
      }
    }).then(function (post) {
      post.get('title').should.equal('About');
      done();
    }).catch(function (error) {
      throw error;
    });
  });
});
