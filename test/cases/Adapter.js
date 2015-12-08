/* global describe, before, after, it */
/* eslint-disable no-invalid-this */
import should from 'should'; // eslint-disable-line

import lib from '../../';
import config from '../config';

import makePosts from '../collections/Posts';
import makeAuthors from '../collections/Authors';

const {Database} = lib;

describe('Adapter', function () {
  before(function () {
    this.db = new Database(config);
    this.Posts = makePosts(this.db);
    this.Authors = makeAuthors(this.db);
  });

  after(function (done) {
    this.db.close().then(done);
  });

  it('should load fixtures for a single Collection', function (done) {
    const posts = new this.Posts();
    const data = require('../fixtures/posts');
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
