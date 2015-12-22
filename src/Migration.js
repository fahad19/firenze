import fs from 'fs';
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

const generatedMigration = ```
var Promise = require('firenze').Promise;

module.exports = {
  before: function (db) {
    return new Promise.resolve(true);
  },

  up: function (schema) {
    return new Promise.resolve(true);
  },

  down: function (schema) {
    return new Promise.resolve(true);
  },

  after: function (db) {
    return new Promise.resolve(true);
  }
};
```;

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
    const files = fs.readDirSync(this.options.directory);
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

          resolve(list);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  run(filename, direction = 'up') {
    const allowedDirections = ['up', 'down'];

    if (allowedDirections.indexOf(direction) === -1) {
      throw new Error('Wrong direction provided.');
    }

    const mig = require(this.options.directory + '/' + filename);
    const {db, table} = this.options;

    return mig(db.schema())
      .then(function () {
        return db.query()
          .table(table)
          .create({
            id: filename,
            created: new Date()
          })
          .run();
      })
      .catch(function (error) {
        throw error;
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
    const filename = datetime + '_' + name + '.js';

    const fullPath = this.options.directory + '/' + filename;

    return new Promise((resolve, reject) => {
      fs.writeFile(fullPath, generatedMigration, {
        encoding: 'utf8'
      }, function (err) {
        if (err) {
          return reject(err);
        }

        resolve(fullPath);
      });
    });
  }
}
