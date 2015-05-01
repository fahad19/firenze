var should = require('should');
var lib = require('../../index');
var config = require('../config');

describe('Fixtures', function () {
  before(function () {
    this.db = new lib.Database(config.mysql);
    this.Post = require('../models/Post')(this.db);
    this.fixtures = lib.fixtures;
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should load fixtures for a single Model', function (done) {
    var post = new this.Post();
    var data = require('../fixtures/posts');
    this.fixtures.load(post, data).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });
});
