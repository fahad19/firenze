/* global describe, it, before, after, firenze, firenzeConfig */
/* eslint-disable no-unused-expressions, no-invalid-this */
import should from 'should'; // eslint-disable-line

const {Database, Migration} = firenze;

describe('Migration', function () {
  before(function () {
    this.db = new Database(firenzeConfig);
  });

  after(function (done) {
    this.db.close().then(done);
  });

  it('should generate new Migration file', function (done) {
    const migration = new Migration({
      db: this.db,
      directory: __dirname + '/../_migrations'
    });

    migration.generate('new migration')
      .then(function (response) {
        console.log('response', response); // eslint-disable-line
        done();
      });
  });
});
