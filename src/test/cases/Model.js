/* global describe, before, after, it */

let should = require('should'); //eslint-disable-line
let lib = require('../../index');
let config = require('../config');

describe('Model', function () {
  before(function () {
    this.db = new lib.Database(config.mysql);
    this.Post = require('../models/Post')(this.db);
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should have an instance', function () {
    let post = new this.Post();
    post.should.have.property('alias').which.is.exactly('Post');
  });

  it('should have a collection', function () {
    let post = new this.Post();
    post.should.have.property('collection');

    let posts = post.collection();
    posts.should.have.property('table').which.is.exactly('posts');
  });

  it('should fetch itself', function (done) {
    let post = new this.Post({
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
    let post = new this.Post({
      id: 2
    });
    post.get('id').should.eql(2);
  });

  it('should set its attributes', function () {
    let post = new this.Post({
      id: 2
    });
    post.set('title', 'Hello World');
    post.get('title').should.eql('Hello World');

    post.set({
      body: 'blah...'
    });
    let postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Hello World',
      body: 'blah...'
    });
  });

  it('should check if it is new', function () {
    let post = new this.Post({
      title: 'Post here'
    });
    post.isNew().should.be.true; //eslint-disable-line

    let anotherPost = new this.Post({
      id: 1,
      title: 'Yo'
    });
    anotherPost.isNew().should.be.false; //eslint-disable-line
  });

  it('should get plain object', function () {
    let post = new this.Post({
      id: 2,
      title: 'Post here'
    });
    let postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Post here'
    });
  });

  it('should create a new record', function (done) {
    let post = new this.Post({
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
    let post = new this.Post({id: 1});
    post.fetch().then(function (model) {
      model.set('title', 'Hello Universe');
      model.save().then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should update particular field', function (done) {
    let post = new this.Post({id: 1});
    post.fetch().then(function (model) {
      model.saveField('title', 'Hello Universe').then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should clear', function () {
    let post = new this.Post({
      id: 1,
      title: 'Hi'
    });
    post.isNew().should.be.false; //eslint-disable-line

    post.clear();
    post.isNew().should.be.true; //eslint-disable-line
  });

  it('should delete a record', function (done) {
    let post = new this.Post({id: 2});
    post.delete().then(function (affectedRows) {
      affectedRows.should.eql(1);
      done();
    });
  });
});
