/* global describe, before, after, it */

var should = require('should'); //eslint-disable-line
var lib = require('../../index');
var config = require('../config');

describe('Fixtures', function () {
  before(function () {
    this.db = new lib.Database(config.mysql);
    this.Post = require('../models/Post')(this.db);
    this.Author = require('../models/Author')(this.db);
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should load fixtures for a single Model', function (done) {
    var post = new this.Post();
    var data = require('../fixtures/posts');
    this.db.getAdapter().loadFixture(post, data).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should load fixtures for multiple models', function (done) {
    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        data: require('../fixtures/posts')
      },
      {
        model: new this.Author(),
        data: require('../fixtures/authors')
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });
});
