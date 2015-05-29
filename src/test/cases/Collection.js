/* global describe, before, after, it */

var _ = require('lodash');
var should = require('should'); //eslint-disable-line
var lib = require('../../index');
var config = require('../config');

describe('Collection', function () {
  before(function (done) {
    this.db = new lib.Database(config);
    this.Posts = require('../collections/Posts')(this.db);
    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: this.postsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
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
    posts.find('all').then(function (models) {
      models.should.be.instanceOf(Array);
      models.should.have.lengthOf(3);

      var firstPost = models[0];
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

  it('should find list', function (done) {
    var posts = new this.Posts();
    posts.find('list').then(function (list) {
      list.should.eql({
        1: 'Hello World',
        2: 'About',
        3: 'Contact'
      });
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find count of results', function (done) {
    var posts = new this.Posts();
    posts.find('count').then(function (count) {
      count.should.equal(3);
      done();
    }).catch(function(error) {
      throw error;
    });
  });
});
