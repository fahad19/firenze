/* global describe, before, after, it */

var should = require('should'); //eslint-disable-line
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

  it('should fetch itself', function (done) {
    var post = new this.Post({
      id: 2
    });
    post.fetch().then(function (model) {
      model.get('title').should.be.exactly('About');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should get its attributes', function () {
    var post = new this.Post({
      id: 2
    });
    post.get('id').should.eql(2);
  });

  it('should set its attributes', function () {
    var post = new this.Post({
      id: 2
    });
    post.set('title', 'Hello World');
    post.get('title').should.eql('Hello World');

    post.set({
      body: 'blah...'
    });
    var postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Hello World',
      body: 'blah...'
    });
  });

  it('should check if it is new', function () {
    var post = new this.Post({
      title: 'Post here'
    });
    post.isNew().should.be.true; //eslint-disable-line

    var anotherPost = new this.Post({
      id: 1,
      title: 'Yo'
    });
    anotherPost.isNew().should.be.false; //eslint-disable-line
  });

  it('should get plain object', function () {
    var post = new this.Post({
      id: 2,
      title: 'Post here'
    });
    var postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Post here'
    });
  });

  it('should create a new record', function (done) {
    var post = new this.Post({
      title: 'New Post',
      body: 'text...'
    });
    post.save().then(function (model) {
      model.get('title').should.eql('New Post');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should update existing record', function (done) {
    var post = new this.Post({id: 1});
    post.fetch().then(function (model) {
      model.set('title', 'Hello Universe');
      model.save().then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });
});
