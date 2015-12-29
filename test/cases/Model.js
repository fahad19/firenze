/* global describe, before, after, it, firenze, firenzeConfig */
/* eslint-disable no-unused-expressions, no-invalid-this */
import should from 'should-promised'; // eslint-disable-line

import makePosts from '../collections/Posts';
import makeAuthors from '../collections/Authors';

import postsData from '../fixtures/posts';
import authorsData from '../fixtures/authors';

const {Database, Promise} = firenze;

describe('Model', function () {
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
    const post = posts.model();
    post.should.have.property('get');
  });

  it('should have a collection', function () {
    const posts = new this.Posts();
    const post = posts.model();
    post.should.have.property('collection');
    post.collection.should.have.property('table').which.is.exactly('posts');
  });

  it('should fetch itself', function (done) {
    const posts = new this.Posts();
    const post = posts.model({
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
    const posts = new this.Posts();
    const post = posts.model({
      id: 2
    });
    post.get('id').should.eql(2);
  });

  it('should set its attributes', function () {
    const posts = new this.Posts();
    const post = posts.model({
      id: 2
    });
    post.set('title', 'Hello World');
    post.get('title').should.eql('Hello World');

    post.set({
      body: 'blah...'
    });
    const postObj = post.toObject();
    postObj.should.have.properties({
      id: 2,
      title: 'Hello World',
      body: 'blah...'
    });
  });

  it('should check if it is new', function () {
    const posts = new this.Posts();
    const post = posts.model({
      title: 'Post here'
    });
    post.isNew().should.be.true; //eslint-disable-line

    const anotherPost = posts.model({
      id: 1,
      title: 'Yo'
    });
    anotherPost.isNew().should.be.false; //eslint-disable-line
  });

  it('should get plain object', function () {
    const posts = new this.Posts();
    const post = posts.model({
      id: 2,
      title: 'Post here'
    });
    const postObj = post.toObject();
    postObj.should.have.properties({
      id: 2,
      title: 'Post here'
    });
  });

  it('should create a new record', function (done) {
    const posts = new this.Posts();
    const post = posts.model({
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
    const posts = new this.Posts();
    const post = posts.model({id: 1});
    post.fetch().then(function (model) {
      model.set('title', 'Hello Universe');
      model.save().then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should update particular field', function (done) {
    const posts = new this.Posts();
    const post = posts.model({id: 1});
    post.fetch().then(function (model) {
      model.saveField('title', 'Hello Universe').then(function (m) {
        m.get('title').should.eql('Hello Universe');
        done();
      });
    });
  });

  it('should clear', function () {
    const posts = new this.Posts();
    const post = posts.model({
      id: 1,
      title: 'Hi'
    });
    post.isNew().should.be.false; //eslint-disable-line

    post.clear();
    post.isNew().should.be.true; //eslint-disable-line
  });

  it('should delete a record', function (done) {
    const posts = new this.Posts();
    const post = posts.model({id: 2});
    post.delete().then(function (affectedRows) {
      affectedRows.should.eql(1);
      done();
    });
  });

  it('should validate a single field', function () {
    const posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
    });
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
            const passed = value === 'Voldemort';
            done(passed);
          }, 100);
        }
      }
    });
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({
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
    const posts = new this.Posts({
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
    const post = posts.model({});

    post
      .validate()
      .should
      .eventually
      .eql({
        title: 'Must be alphabets only'
      });
  });

  it('should not save if validation fails', function (done) {
    const posts = new this.Posts({
      schema: {
        title: {
          validate: {
            rule: 'isAlphanumeric',
            message: 'Must be alphanumeric'
          }
        }
      }
    });
    const post = posts.model({
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

  it('should support transactions - saving with rollback', function (done) {
    const posts = new this.Posts();
    const authors = new this.Authors();

    const post = posts.model({
      title: 'Hogwarts: A History'
    });

    const author = authors.model({
      name: 'Bathilda Bagshot',
      sup: 'hey' // should fail
    });

    const db = this.db;

    db
      .transaction(function (t) {
        return Promise.all([
          // first
          post
            .transact(t)
            .save(),

          // second
          author
            .transact(t)
            .save()
        ]);
      })
      .catch(function () {
        db.query()
          .table('posts')
          .where({title: 'Hogwarts: A History'})
          .count()
          .run()
          .then(function (count) {
            count.should.eql(0);

            return db.query()
              .table('authors')
              .where({name: 'Bathilda Bagshot'})
              .count()
              .run();
          })
          .then(function (count) {
            count.should.eql(0);

            done();
          });
      });
  });

  it('should support transactions - saving with commit', function (done) {
    const posts = new this.Posts();
    const authors = new this.Authors();

    const post = posts.model({
      title: 'Hogwarts: A History'
    });

    const author = authors.model({
      name: 'Bathilda Bagshot'
    });

    const db = this.db;

    db
      .transaction(function (t) {
        return Promise.all([
          // first
          post
            .transact(t)
            .save(),

          // second
          author
            .transact(t)
            .save()
        ]);
      })
      .then(function () {
        db.query()
          .table('posts')
          .where({title: 'Hogwarts: A History'})
          .count()
          .run()
          .then(function (count) {
            count.should.eql(1);

            return db.query()
              .table('authors')
              .where({name: 'Bathilda Bagshot'})
              .count()
              .run();
          })
          .then(function (count) {
            count.should.eql(1);

            done();
          });
      });
  });
});
