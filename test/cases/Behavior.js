/* global describe, before, after, it */
/* eslint-disable no-unused-expressions */
import should from 'should-promised';

import {Database} from '../../src';
import config from '../config';

describe('Behavior', function () {
  before(function (done) {
    this.db = new Database(config);

    this.Posts = require('../collections/Posts')(this.db);
    this.postsData = require('../fixtures/posts');

    this.Authors = require('../collections/Authors')(this.db);
    this.authorsData = require('../fixtures/authors');

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
