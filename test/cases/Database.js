/* global describe, it */
import should from 'should'; // eslint-disable-line

import lib from '../../';
import config from '../config';

import makePosts from '../collections/Posts';

const {Database} = lib;

describe('Database', function () {
  it('should connect and disconnect from server', function (done) {
    const db = new Database(config);
    db.close().then(done);
  });

  it('should generate Collection class', function (done) {
    const db = new Database(config);
    const Posts = makePosts(db);

    const posts = new Posts();
    posts.table.should.be.exactly('posts');
    db.close().then(done);
  });
});
