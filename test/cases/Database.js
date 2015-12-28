/* global describe, it, firenze, firenzeConfig */
import should from 'should'; // eslint-disable-line

import makePosts from '../collections/Posts';

const {Database, Promise} = firenze;

describe('Database', function () {
  it('should connect and disconnect from server', function (done) {
    const db = new Database(firenzeConfig);
    db.close().then(done);
  });

  it('should generate Collection class', function (done) {
    const db = new Database(firenzeConfig);
    const Posts = makePosts(db);

    const posts = new Posts();
    posts.table.should.be.exactly('posts');
    db.close().then(done);
  });

  it('should wrap transaction calls', function (done) {
    const db = new Database(firenzeConfig);

    db
      .transaction(function () {
        this.close.should.be.of.type('function'); // eslint-disable-line

        return new Promise.resolve(true);
      })
      .then(function () {
        done();
      });
  });
});
