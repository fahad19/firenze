/* global describe, before, after, it */
/* eslint-disable no-unused-expressions */

var should = require('should-promised'); //eslint-disable-line
var lib = require('../../index');
var config = require('../config');
var P = require('../../Promise');

describe('Model', function () {
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

  it('should have an instance', function () {
    var posts = new this.Posts();
    var post = posts.model();
    post.should.have.property('get');
  });

  it('should have a collection', function () {
    var posts = new this.Posts();
    var post = posts.model();
    post.should.have.property('collection');
    post.collection.should.have.property('table').which.is.exactly('posts');
  });

  it('should fetch itself', function (done) {
    var posts = new this.Posts();
    var post = posts.model({
      id: 2
    });
    post.fetch().then(function (model) {
      model.get('title').should.be.exactly('About');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should get its attributes', function () {
    var posts = new this.Posts();
    var post = posts.model({
      id: 2
    });
    post.get('id').should.eql(2);
  });

  it('should set its attributes', function () {
    var posts = new this.Posts();
    var post = posts.model({
      id: 2
    });
    post.set('title', 'Hello World');
    post.get('title').should.eql('Hello World');

    post.set({
      body: 'blah...'
    });
    var postObj = post.toObject();
    postObj.should.have.properties({
      id: 2,
      title: 'Hello World',
      body: 'blah...'
    });
  });

  it('should check if it is new', function () {
    var posts = new this.Posts();
    var post = posts.model({
      title: 'Post here'
    });
    post.isNew().should.be.true; //eslint-disable-line

    var anotherPost = posts.model({
      id: 1,
      title: 'Yo'
    });
    anotherPost.isNew().should.be.false; //eslint-disable-line
  });

  it('should get plain object', function () {
    var posts = new this.Posts();
    var post = posts.model({
      id: 2,
      title: 'Post here'
    });
    var postObj = post.toObject();
    postObj.should.have.properties({
      id: 2,
      title: 'Post here'
    });
  });

  it('should create a new record', function (done) {
    var posts = new this.Posts();
    var post = posts.model({
      title: 'New Post',
      body: 'text...'
    });
    post.save().then(function (model) {
      model.get('title').should.eql('New Post');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should update existing record', function (done) {
    var posts = new this.Posts();
    var post = posts.model({id: 1});
    post.fetch().then(function (model) {
      model.set('title', 'Hello Universe');
      model.save().then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should update particular field', function (done) {
    var posts = new this.Posts();
    var post = posts.model({id: 1});
    post.fetch().then(function (model) {
      model.saveField('title', 'Hello Universe').then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should clear', function () {
    var posts = new this.Posts();
    var post = posts.model({
      id: 1,
      title: 'Hi'
    });
    post.isNew().should.be.false; //eslint-disable-line

    post.clear();
    post.isNew().should.be.true; //eslint-disable-line
  });

  it('should delete a record', function (done) {
    var posts = new this.Posts();
    var post = posts.model({id: 2});
    post.delete().then(function (affectedRows) {
      affectedRows.should.eql(1);
      done();
    });
  });

  it('should validate a single field', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be alphanumeric');

    post.set('title', 'hello');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should validate a single field with multiple rules', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: [
            {
              rule: 'isAlphanumeric',
              message: 'Must be alphanumeric'
            },
            {
              rule: [
                'isIn',
                [
                  'Strawberry',
                  'banana',
                  'apple'
                ]
              ],
              message: 'Must be a fruit'
            },
            {
              rule: 'isLowercase',
              message: 'Must be lowercase'
            }
          ]
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be alphanumeric');

    post.set('title', 'hello');
    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be a fruit');

    post.set('title', 'apple');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should validate a single field with validator options', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: [
            {
              rule: [
                'isIn',
                [
                  'apple',
                  'banana'
                ]
              ],
              message: 'Must be a fruit'
            }
          ]
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be a fruit');

    post.set('title', 'apple');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should validate a single field with custom rule function', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: function (field, value) {
              return value === 'Voldemort';
            },
            message: 'Must be Voldemort'
          }
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be Voldemort');

    post.set('title', 'Voldemort');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should validate a single field with custom pre-defined rule function', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'voldemort',
            message: 'Must be Voldemort'
          }
        }
      },
      validationRules: {
        voldemort: function (field, value) {
          return value === 'Voldemort';
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be Voldemort');

    post.set('title', 'Voldemort');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should validate a single field with async rule function', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'voldemort',
            message: 'Must be Voldemort'
          }
        }
      },
      validationRules: {
        voldemort: function (field, value, done) {
          setTimeout(function () {
            var passed = value === 'Voldemort';
            done(passed);
          }, 100);
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .validateField('title')
      .should
      .eventually
      .equal('Must be Voldemort');

    post.set('title', 'Voldemort');
    post
      .validateField('title')
      .should
      .eventually
      .be
      .true;
  });

  it('should try to validate model with all fields', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        },
        body: {
          validate: {
            rule: 'isAlpha',
            message: 'Must be alphabets only'
          }
        }
      }
    });
    var post = posts.model({
      title: 'Hello World',
      body: 'Blah... 123'
    });

    post
      .validate()
      .should
      .eventually
      .eql({
        title: 'Must be alphanumeric',
        body: 'Must be alphabets only'
      });
  });

  it('should validate model with all fields successfully', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        },
        body: {
          validate: {
            rule: 'isAlpha',
            message: 'Must be alphabets only'
          }
        }
      }
    });
    var post = posts.model({
      title: 'hello',
      body: 'blah'
    });

    post
      .validate()
      .should
      .eventually
      .be
      .true;
  });

  it('should validate required fields', function () {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlpha',
            required: true,
            message: 'Must be alphabets only'
          }
        }
      }
    });
    var post = posts.model({});

    post
      .validate()
      .should
      .eventually
      .eql({
        title: 'Must be alphabets only'
      });
  });

  it('should not save if validation fails', function (done) {
    var posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
    });
    var post = posts.model({
      title: 'Hello World'
    });

    post
      .save()
      .catch(function (error) {
        error
          .should
          .eql({
            validationErrors: {
              title: 'Must be alphanumeric'
            }
          });
        done();
      });
  });

  it('should fire beforeSave callback', function (done) {
    var posts = new this.Posts({
      beforeSave: function (model) {
        return new P((resolve) => {
          model.set('title', 'I am new again');
          return resolve(true);
        });
      }
    });
    var post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am new again');
      done();
    });
  });

  it('should fire afterSave callback', function (done) {
    var posts = new this.Posts({
      afterSave: function (model) {
        return new P((resolve) => {
          model.set('title', 'I am modified in afterSave');
          return resolve(true);
        });
      }
    });
    var post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in afterSave');
      done();
    });
  });

  it('should fire beforeValidate callback', function (done) {
    var posts = new this.Posts({
      beforeValidate: function (model) {
        return new P((resolve) => {
          model.set('title', 'I am modified in beforeValidate');
          return resolve(true);
        });
      }
    });
    var post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in beforeValidate');
      done();
    });
  });

  it('should fire afterValidate callback', function (done) {
    var posts = new this.Posts({
      afterValidate: function (model) {
        return new P((resolve) => {
          model.set('title', 'I am modified in afterValidate');
          return resolve(true);
        });
      }
    });
    var post = posts.model({
      title: 'I am new'
    });

    post.save().then(function (model) {
      model.get('title').should.equal('I am modified in afterValidate');
      done();
    });
  });

  it('should fire beforeDelete callback', function (done) {
    var authors = new this.Authors();
    var author = authors.model({
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
    var posts = new this.Posts();
    var post = posts.model({
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
