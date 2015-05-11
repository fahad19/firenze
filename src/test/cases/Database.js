/* global describe, it */

let should = require('should'); //eslint-disable-line
let lib = require('../../index');
let config = require('../config');

describe('Database', function () {
  it('should connect and disconnect from server', function (done) {
    let db = new lib.Database(config.mysql);
    db.close(done);
  });

  it('should generate Collection class', function (done) {
    let db = new lib.Database(config.mysql);
    let Posts = require('../collections/Posts')(db);

    let posts = new Posts();
    posts.table.should.be.exactly('posts');
    db.close(done);
  });

  it('should generate Model class', function (done) {
    let db = new lib.Database(config.mysql);
    let Post = require('../models/Post')(db);

    let post = new Post();
    post.alias.should.be.exactly('Post');
    db.close(done);
  });
});
