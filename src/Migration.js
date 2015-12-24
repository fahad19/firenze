import fs from 'fs';
import path from 'path';

import async from 'async';
import _ from 'lodash';

import Promise from './Promise';

const migrationsTableSchema = {
  id: {
    type: 'string',
    nullable: false,
    primary: true
  },
  created: {
    type: 'datetime',
    nullable: true
  }
};

const generatedMigration = _.trimLeft(`
var Promise = require('firenze').Promise;

module.exports = {
  before: function (db, direction) {
    return new Promise.resolve(true);
  },

  up: function (db) {
    return new Promise.resolve(true);
  },

  down: function (db) {
    return new Promise.resolve(true);
  },

  after: function (db, direction) {
    return new Promise.resolve(true);
  }
};
`);

export default class Migration {
  constructor(options = {}) {
    if (typeof options.db === 'undefined') {
      throw new Error('Database instance not provided.');
    }

    this.options = {
      directory: process.cwd() + '/migrations',
      table: 'migrations',
      db: null,
      ...options
    };
  }

  initTable() {
    const schema = this.options.db.schema();
    const {table} = this.options;

    return schema.tableExists(table)
      .then(function (exists) {
        if (exists) {
          return true;
        }

        return schema.createTable('migrations', migrationsTableSchema);
      })
      .catch((error) => {
        throw error;
      });
  }

  list() {
    const files = fs.readdirSync(this.options.directory);
    const {db, table} = this.options;

    return new Promise((resolve, reject) => {
      db.query()
        .table(table)
        .run()
        .then(function (records) {
          const recordsByIds = {};

          records.forEach((record) => {
            const {id} = record;
            recordsByIds[id] = record;
          });

          const recordIds = _.keys(recordsByIds);
          const list = [];

          files.forEach(function (file) {
            if (recordIds.indexOf(file) > -1) {
              // already run
              list.push({
                id: file,
                created: recordsByIds[file].created,
                run: true
              });

              return;
            }

            // not run yet
            list.push({
              id: file,
              run: false
            });
          });

          resolve(_.sortByOrder(list, ['id', 'asc']));
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  current() {
    const {db, table} = this.options;

    return db.query()
      .table(table)
      .orderBy({created: 'desc'})
      .first();
  }

  run(filename, direction = 'up') {
    const allowedDirections = ['up', 'down'];

    if (allowedDirections.indexOf(direction) === -1) {
      throw new Error('Wrong direction provided.');
    }

    const mig = require(this.options.directory + '/' + filename);
    const {db, table} = this.options;

    return new Promise((resolve, reject) => {
      async.waterfall([
        // before
        (callback) => {
          mig.before(db, direction)
            .then(response => callback(null, response))
            .catch(error => callback(error));
        },

        // up/down
        (response, callback) => {
          mig[direction](db)
            .then(response => callback(null, response))
            .catch(error => callback(error));
        },

        // after
        (response, callback) => {
          mig.after(db, direction)
            .then(response => callback(null, response))
            .catch(error => callback(error));
        },

        // create/remove record
        (response, callback) => {
          const query = db.query()
            .table(table);

          if (direction === 'up') {
            query
              .create({
                id: filename,
                created: new Date()
              });
          } else {
            query
              .where({
                id: filename
              })
              .delete();
          }

          query
            .run()
            .then(response => callback(null, response))
            .catch(error => callback(error));
        }
      ], (error, response) => {
        if (error) {
          return reject(error);
        }

        resolve(response);
      });
    });
  }

  runAll() {
    return new Promise((resolve, reject) => {
      this.list()
        .then((list) => {
          async.eachSeries(list, (item, callback) => {
            if (item.run) {
              return callback();
            }

            this.run(item.id)
              .then(() => {
                callback();
              })
              .catch((error) => {
                callback(error);
              });
          }, (error) => {
            if (error) {
              return reject(error);
            }

            resolve(true);
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  generate(name) {
    const datetime = new Date().toISOString().slice(0, 19).replace(/[T\-\:]/g, '');
    const filename = datetime + '_' + _.camelCase(name) + '.js';

    const directoryPath = path.normalize(this.options.directory);
    const fullPath = directoryPath + '/' + filename;

    return new Promise((resolve, reject) => {
      async.waterfall([
        // create directory if needed
        (callback) => {
          fs.stat(directoryPath, (error, stats) => {
            if (error && error.code !== 'ENOENT') {
              return callback(error);
            }

            if (stats && stats.isDirectory()) {
              return callback(null, true);
            }

            fs.mkdir(directoryPath, (error) => {
              if (error) {
                return callback('Could not create directory at: ' + directoryPath);
              }

              callback(null, true);
            });
          });
        },

        // create migration file
        (result, callback) => {
          fs.writeFile(fullPath, generatedMigration, {
            encoding: 'utf8'
          }, function (err) {
            if (err) {
              return callback(err);
            }

            callback(null, fullPath);
          });
        }
      ], (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }
}
