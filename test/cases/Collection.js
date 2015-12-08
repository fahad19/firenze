/* global describe, before, after, it, firenze, firenzeConfig */
/* eslint-disable no-invalid-this */
import should from 'should'; // eslint-disable-line

import makePosts from '../collections/Posts';
import makeAuthors from '../collections/Authors';

import postsData from '../fixtures/posts';
import authorsData from '../fixtures/authors';

const {Database, Promise} = firenze;

describe('Collection', function () {
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

  it('should have an instance', function () {
    const posts = new this.Posts();
    posts.should.have.property('table').which.is.exactly('posts');
  });

  it('should have a model', function () {
    const posts = new this.Posts();
    posts.should.have.property('model');

    const post = posts.model();
    post.should.have.property('get');
  });

  it('should find all results', function (done) {
    const posts = new this.Posts();
    posts.find()
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(3);

        const firstPost = models[0];
        firstPost.should.have.property('attributes');
        firstPost.attributes.title.should.be.exactly('Hello World');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find single result', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where({id: 1})
      .first()
      .then(function (post) {
        post.get('title').should.equal('Hello World');
        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find count of results', function (done) {
    const posts = new this.Posts();
    posts.find()
      .count()
      .run()
      .then(function (count) {
        count.should.equal(3);
        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find single result by primaryKey', function (done) {
    const posts = new this.Posts();
    const promise = posts.findById(1);

    promise.then(function (post) {
      post.get('title').should.equal('Hello World');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result by field', function (done) {
    const posts = new this.Posts();
    posts.findBy('title', 'Hello World').then(function (post) {
      post.get('title').should.equal('Hello World');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should fire beforeSave callback', function (done) {
    const posts = new this.Posts({
      beforeSave: function (model) {
        return new Promise((resolve) => {
          model.set('title', 'I am new again');
          return resolve(true);
        });
      }
    });
    const post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am new again');
      done();
    });
  });

  it('should fire afterSave callback', function (done) {
    const posts = new this.Posts({
      afterSave: function (model) {
        return new Promise((resolve) => {
          model.set('title', 'I am modified in afterSave');
          return resolve(true);
        });
      }
    });
    const post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in afterSave');
      done();
    });
  });

  it('should fire beforeValidate callback', function (done) {
    const posts = new this.Posts({
      beforeValidate: function (model) {
        return new Promise((resolve) => {
          model.set('title', 'I am modified in beforeValidate');
          return resolve(true);
        });
      }
    });
    const post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in beforeValidate');
      done();
    });
  });

  it('should fire afterValidate callback', function (done) {
    const posts = new this.Posts({
      afterValidate: function (model) {
        return new Promise((resolve) => {
          model.set('title', 'I am modified in afterValidate');
          return resolve(true);
        });
      }
    });
    const post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in afterValidate');
      done();
    });
  });

  it('should fire beforeDelete callback', function (done) {
    const authors = new this.Authors();
    const author = authors.model({
      id: 1
    });
    author.fetch().then(function (model) {
      model
        .delete()
        .catch(function (error) {
          error.should.eql(true);
        })
        .finally(function () {
          done();
        });
    });
  });

  it('should fire afterDelete callback', function (done) {
    const posts = new this.Posts();
    const post = posts.model({
      id: 2
    });
    post.fetch().then(function (model) {
      model
        .delete()
        .then(function () {
          model.get('_field').should.eql('afterDelete');
          done();
        });
    });
  });
});
