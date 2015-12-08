/* global describe, before, after, it, firenze, firenzeConfig */
/* eslint-disable no-unused-expressions, no-invalid-this */
import should from 'should-promised'; // eslint-disable-line

import makePosts from '../collections/Posts';
import makeAuthors from '../collections/Authors';

import postsData from '../fixtures/posts';
import authorsData from '../fixtures/authors';

const {Database} = firenze;

describe('Behavior', function () {
  before(function (done) {
    this.db = new Database(firenzeConfig);

    this.Posts = makePosts(this.db);
    this.postsData = postsData;

    this.Authors = makeAuthors(this.db);
    this.authorsData = authorsData;

    this.db.getAdapter().loadAllFixtures([
      {
        collection: new this.Posts(),
        rows: this.postsData
      },
      {
        collection: new this.Authors(),
        rows: this.authorsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  after(function (done) {
    this.db.close().then(done);
  });

  it('should load in collection', function () {
    const posts = new this.Posts();
    posts.loadedBehaviors.length.should.eql(1);
  });

  it('should fire sync callback in model', function () {
    const posts = new this.Posts();
    const post = posts.model({
      title: 'New Post',
      body: 'text...'
    });

    post.get('created').should.be.instanceOf(Date);
  });

  it('should fire async callback in model', function (done) {
    const posts = new this.Posts();
    const post = posts.model({
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
