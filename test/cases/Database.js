/* global describe, it */

var should = require('should'); //eslint-disable-line
var lib = require('../../src/index');
var config = require('../config');

describe('Database', function () {
  it('should connect and disconnect from server', function (done) {
    var db = new lib.Database(config);
    db.close().then(done);
  });

  it('should generate Collection class', function (done) {
    var db = new lib.Database(config);
    var Posts = require('../collections/Posts')(db);

    var posts = new Posts();
    posts.table.should.be.exactly('posts');
    db.close().then(done);
  });
});
