/* global describe, before, after, it */

var should = require('should'); //eslint-disable-line
var lib = require('../../src/index');
var config = require('../config');

describe('Adapter', function () {
  before(function () {
    this.db = new lib.Database(config);
    this.Posts = require('../collections/Posts')(this.db);
    this.Authors = require('../collections/Authors')(this.db);
  });

  after(function (done) {
    this.db.close().then(done);
  });

  it('should load fixtures for a single Collection', function (done) {
    var posts = new this.Posts();
    var data = require('../fixtures/posts');
    this.db.getAdapter().loadFixture(posts, data).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should load fixtures for multiple collections', function (done) {
    this.db.getAdapter().loadAllFixtures([
      {
        collection: new this.Posts(),
        rows: require('../fixtures/posts')
      },
      {
        collection: new this.Authors(),
        rows: require('../fixtures/authors')
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });
});
