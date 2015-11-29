/* global describe, before, after, it */

var should = require('should'); //eslint-disable-line
var lib = require('../../index');
var config = require('../config');
var P = require('../../Promise');

describe('Query', function () {
  before(function (done) {
    this.db = new lib.Database(config);

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

  it('should find all by limiting', function (done) {
    var posts = new this.Posts();
    posts.find()
      .limit(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        var firstPost = models[0];
        firstPost.should.have.property('attributes');
        firstPost.attributes.title.should.be.exactly('Hello World');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by offsetting', function (done) {
    var posts = new this.Posts();
    posts.find()
      .limit(1)
      .offset(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        var firstPost = models[0];
        firstPost.should.have.property('attributes');
        firstPost.attributes.title.should.be.exactly('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by sorting', function (done) {
    var posts = new this.Posts();
    posts.find()
      .orderBy({
        title: 'asc'
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(3);

        var titles = [];
        models.forEach(function (model) {
          titles.push(model.get('title'));
        });

        titles.should.eql([
          'About',
          'Contact',
          'Hello World'
        ]);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by grouping', function (done) {
    var posts = new this.Posts();
    posts.find()
      .groupBy('author_id')
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);

        var titles = [];
        models.forEach(function (model) {
          titles.push(model.get('title'));
        });

        titles.should.eql([
          'Hello World',
          'Contact'
        ]);

        done();
      }).catch(function (error) {
        throw error;
      });
  });
});
