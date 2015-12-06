/* global describe, before, after, it */
import should from 'should';

import {Database, Promise} from '../../src';
import config from '../config';

describe('Query', function () {
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

  it('should find with distinct', function (done) {
    const posts = new this.Posts();
    posts.find()
      .distinct('author_id')
      .run()
      .then(function (results) {
        const authorIds = results.map(function (result) {
          return result.author_id;
        });

        authorIds.should.eql([
          1,
          2
        ]);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by limiting', function (done) {
    const posts = new this.Posts();
    posts.find()
      .limit(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        const firstPost = models[0];
        firstPost.should.have.property('attributes');
        firstPost.attributes.title.should.be.exactly('Hello World');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by offsetting', function (done) {
    const posts = new this.Posts();
    posts.find()
      .limit(1)
      .offset(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        const firstPost = models[0];
        firstPost.should.have.property('attributes');
        firstPost.attributes.title.should.be.exactly('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by pagination', function (done) {
    const posts = new this.Posts();
    posts.find()
      .limit(1)
      .page(2)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        models[0].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by sorting', function (done) {
    const posts = new this.Posts();
    posts.find()
      .orderBy({
        title: 'asc'
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(3);

        const titles = [];
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
    const posts = new this.Posts();
    posts.find()
      .groupBy('author_id')
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);

        const titles = [];
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

  it('should find all with selected fields', function (done) {
    const posts = new this.Posts();
    posts.find()
      .select('id', 'title')
      .limit(1)
      .run()
      .then(function (results) {
        results.should.be.instanceOf(Array);
        results.should.have.lengthOf(1);
        results[0].should.eql({
          id: 1,
          title: 'Hello World'
        });

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all with selected fields, with renaming', function (done) {
    const posts = new this.Posts();
    posts.find()
      .select('id', 'title', {title2: 'title'})
      .limit(1)
      .run()
      .then(function (results) {
        results.should.be.instanceOf(Array);
        results.should.have.lengthOf(1);
        results[0].should.eql({
          id: 1,
          title: 'Hello World',
          title2: 'Hello World'
        });

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all with selected fields, with chained column functions', function (done) {
    const posts = new this.Posts();
    const query = posts.find();

    query
      .select('id', 'title', {
        titleUppercased: query.func('title')
          .upper()
          .lower()
          .upper()
       })
      .limit(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('titleUppercased').should.eql('HELLO WORLD');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all with selected fields, with embedded column function', function (done) {
    const posts = new this.Posts();
    posts.find()
      .select('id', 'title', {
        titleUppercased: function (func) {
          return func('title')
            .upper()
            .lower()
            .upper();
        }
      })
      .limit(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('titleUppercased').should.eql('HELLO WORLD');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all with selected fields, with concat function', function (done) {
    const posts = new this.Posts();
    posts.find()
      .select('id', 'title', {
        idAndTitle: function (func) {
          return func()
            .concat('id', JSON.stringify(' '), 'title')
            .upper();
        }
      })
      .limit(1)
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('idAndTitle').should.eql('1 HELLO WORLD');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by conditions', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where({id: 2})
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by conditions, with AND', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where({id: 2})
      .andWhere({title: 'About'})
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by conditions, with OR', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where({id: 2})
      .orWhere({title: 'Contact'})
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);

        models[0].get('title').should.eql('About');
        models[1].get('title').should.eql('Contact');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find all by conditions, with NOT', function (done) {
    const posts = new this.Posts();
    posts.find()
      .notWhere({title: 'Contact'})
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);

        models[0].get('title').should.eql('Hello World');
        models[1].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - equals (=)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.eq('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);

        models[0].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - not equals (!=)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.notEq('id', 1);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);

        models[0].get('id').should.eql(2);
        models[1].get('id').should.eql(3);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - less than (<)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.lt('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('id').should.eql(1);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - less than and equals (<=)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.lte('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('id').should.eql(1);
        models[1].get('id').should.eql(2);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - greater than (>)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.gt('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('id').should.eql(3);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - greater than and equals (>=)', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.gte('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('id').should.eql(2);
        models[1].get('id').should.eql(3);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - like', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.like('title', '%ontac%');
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('title').should.eql('Contact');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - not like', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.notLike('title', '%ontac%');
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('title').should.eql('Hello World');
        models[1].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - between', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.between('views', 15, 25);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - not between', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.notBetween('views', 15, 25);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('title').should.eql('Hello World');
        models[1].get('title').should.eql('Contact');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - in', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.in('id', [1, 2]);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('id').should.eql(1);
        models[1].get('id').should.eql(2);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - not in', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr.notIn('id', [1, 2]);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('id').should.eql(3);

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - is null', function (done) {
    const authors = new this.Authors();
    authors.find()
      .where(function (expr) {
        expr.isNull('country');
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('name').should.eql('Salazar Slytherin');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by expression - is not null', function (done) {
    const authors = new this.Authors();
    authors.find()
      .where(function (expr) {
        expr.isNotNull('country');
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('name').should.eql('Fahad Ibnay Heylaal');
        models[1].get('name').should.eql('Harry Potter');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by chaining expressions', function (done) {
    const authors = new this.Authors();
    authors.find()
      .where(function (expr) {
        expr
          .like('name', 'Fahad%')
          .isNotNull('country');
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(1);
        models[0].get('name').should.eql('Fahad Ibnay Heylaal');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by multiple scoped function expressions', function (done) {
    const authors = new this.Authors();
    authors.find()
      .where(function (expr) {
        expr.eq('id', 1);
      })
      .orWhere(function (expr) {
        expr.eq('id', 2);
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('name').should.eql('Fahad Ibnay Heylaal');
        models[1].get('name').should.eql('Harry Potter');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find by multiple nested expressions', function (done) {
    const posts = new this.Posts();
    posts.find()
      .where(function (expr) {
        expr
          .eq('id', 1)
          .and({
            title: 'Hello World'
          })
          .and(function (expr) {
            expr
              .eq('views', 10)
              .eq('body', 'blah...');
          });
      })
      .orWhere(function (expr) {
        expr
          .eq('id', 2)
          .or(function (expr) {
            expr
              .eq('title', 'About');
          });
      })
      .all()
      .then(function (models) {
        models.should.be.instanceOf(Array);
        models.should.have.lengthOf(2);
        models[0].get('title').should.eql('Hello World');
        models[1].get('title').should.eql('About');

        done();
      }).catch(function (error) {
        throw error;
      });
  });

  it('should find with JOINs - left', function (done) {
    this.db.query()
      .from('posts', 'Post')
      .where({
        'Post.id': 1
      })
      .leftJoin('authors', 'Author', function (expr) {
        expr.eq('Post.author_id', 'Author.id');
      })
      .all()
      .then(function (results) {
        results[0].title.should.eql('Hello World');
        results[0].name.should.eql('Fahad Ibnay Heylaal');

        done();
      }).catch(function (error) {
        throw error;
      });
  });
});
