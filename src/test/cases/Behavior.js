/* global describe, before, after, it */
/* eslint-disable no-unused-expressions */

var should = require('should-promised'); //eslint-disable-line
var lib = require('../../index');
var config = require('../config');
var P = require('../../Promise');

describe('Behavior', function () {
  before(function (done) {
    this.db = new lib.Database(config);

    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    this.Author = require('../models/Author')(this.db);
    this.authorsData = require('../fixtures/authors');

    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: this.postsData
      },
      {
        model: new this.Author(),
        rows: this.authorsData
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

  it('should load in model', function () {
    var post = new this.Post({
      title: 'New Post',
      body: 'text...'
    });

    post.loadedBehaviors.length.should.eql(1);
  });

  it('should fire sync callback in model', function () {
    var post = new this.Post({
      title: 'New Post',
      body: 'text...'
    });

    post.get('created').should.be.instanceOf(Date);
  });

  it('should fire async callback in model', function (done) {
    var post = new this.Post({
      title: 'New Post',
      body: 'text...'
    });

    post.save()
      .then(function (model) {
        model.get('updated').should.be.instanceOf(Date);
      })
      .finally(done);
  });
});
