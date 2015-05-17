/* global describe, before, after, it */

var should = require('should-promised');
var lib = require('../../index');
var config = require('../config');

describe('Model', function () {
  before(function (done) {
    this.db = new lib.Database(config.mysql);
    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: this.postsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should have an instance', function () {
    var post = new this.Post();
    post.should.have.property('alias').which.is.exactly('Post');
  });

  it('should have a collection', function () {
    var post = new this.Post();
    post.should.have.property('collection');

    var posts = post.collection();
    posts.should.have.property('table').which.is.exactly('posts');
  });

  it('should fetch itself', function (done) {
    var post = new this.Post({
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
    var post = new this.Post({
      id: 2
    });
    post.get('id').should.eql(2);
  });

  it('should set its attributes', function () {
    var post = new this.Post({
      id: 2
    });
    post.set('title', 'Hello World');
    post.get('title').should.eql('Hello World');

    post.set({
      body: 'blah...'
    });
    var postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Hello World',
      body: 'blah...'
    });
  });

  it('should check if it is new', function () {
    var post = new this.Post({
      title: 'Post here'
    });
    post.isNew().should.be.true; //eslint-disable-line

    var anotherPost = new this.Post({
      id: 1,
      title: 'Yo'
    });
    anotherPost.isNew().should.be.false; //eslint-disable-line
  });

  it('should get plain object', function () {
    var post = new this.Post({
      id: 2,
      title: 'Post here'
    });
    var postObj = post.toObject();
    postObj.should.eql({
      id: 2,
      title: 'Post here'
    });
  });

  it('should create a new record', function (done) {
    var post = new this.Post({
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
    var post = new this.Post({id: 1});
    post.fetch().then(function (model) {
      model.set('title', 'Hello Universe');
      model.save().then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should update particular field', function (done) {
    var post = new this.Post({id: 1});
    post.fetch().then(function (model) {
      model.saveField('title', 'Hello Universe').then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should clear', function () {
    var post = new this.Post({
      id: 1,
      title: 'Hi'
    });
    post.isNew().should.be.false; //eslint-disable-line

    post.clear();
    post.isNew().should.be.true; //eslint-disable-line
  });

  it('should delete a record', function (done) {
    var post = new this.Post({id: 2});
    post.delete().then(function (affectedRows) {
      affectedRows.should.eql(1);
      done();
    });
  });

  it('should validate a single field', function () {
    var post = new this.Post({
      title: 'Hello World'
    }, {
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
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
    var post = new this.Post({
      title: 'Hello World'
    }, {
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
    var post = new this.Post({
      title: 'Hello World'
    }, {
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
    var post = new this.Post({
      title: 'Hello World'
    }, {
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
    var post = new this.Post({
      title: 'Hello World'
    }, {
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
    var post = new this.Post({
      title: 'Hello World'
    }, {
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
    var post = new this.Post({
      title: 'Hello World',
      body: 'Blah... 123'
    }, {
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
    var post = new this.Post({
      title: 'hello',
      body: 'blah'
    }, {
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

    post
      .validate()
      .should
      .eventually
      .be
      .true;
  });

  it('should not save if validation fails', function (done) {
    var post = new this.Post({
      title: 'Hello World'
    }, {
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
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
});
