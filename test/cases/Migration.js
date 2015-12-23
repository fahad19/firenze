/* global describe, it, before, after, firenze, firenzeConfig */
/* eslint-disable no-unused-expressions, no-invalid-this */
import should from 'should'; // eslint-disable-line

const {Database, Migration} = firenze;
const directoryPath = __dirname + '/../_migrations';

describe('Migration', function () {
  before(function (done) {
    this.db = new Database(firenzeConfig);

    this.db.query()
      .table('migrations')
      .truncate()
      .run()
      .then(function () {
        done();
      });
  });

  after(function (done) {
    this.db.close().then(done);
  });

  it('should generate new Migration file', function (done) {
    const migration = new Migration({
      db: this.db,
      directory: directoryPath
    });

    migration.generate('new migration')
      .then(function (response) {
        response.should.be.a.String;

        done();
      });
  });

  it('should init migrations table', function (done) {
    const migration = new Migration({
      db: this.db,
      directory: directoryPath
    });

    migration.initTable()
      .then(function () {
        done();
      });
  });

  it('should list migrations', function (done) {
    const migration = new Migration({
      db: this.db,
      directory: directoryPath
    });

    migration.list()
      .then(function (list) {
        list.should.be.instanceOf(Array);
        list[0].id.should.be.a.String;
        list[0].run.should.be.a.Boolean;

        done();
      });
  });

  it('should run a migration', function (done) {
    const migration = new Migration({
      db: this.db,
      directory: __dirname + '/../migrations'
    });

    migration.list()
      .then(function (list) {
        list.should.be.instanceOf(Array);
        list[0].run.should.be.false;

        return migration.run(list[0].id);
      })
      .then(function () {
        return migration.list();
      })
      .then(function (list) {
        list[0].run.should.be.true;
      })
      .then(function () {
        done();
      });
  });
});
