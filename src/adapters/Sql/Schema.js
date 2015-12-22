import _ from 'lodash';

import P from '../../Promise';
import Schema from '../../Schema';

export default class SqlSchema extends Schema {
  dropTableOfCollection(collection) {
    const connection = this.getConnection();
    const table = collection.table;

    return new P(function (resolve, reject) {
      connection.schema.dropTableIfExists(table)
        .then(function (response) {
          return resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  createTableFromCollection(collection) {
    const connection = this.getConnection();
    const table = collection.table;

    return new P(function (resolve, reject) {
      connection.schema.createTable(table, function (t) {
        _.each(collection.schema, function (column, name) {
          const args = [name];
          const lookForArgs = [
            'length',
            'textType',
            'precision',
            'scale',
            'values'
          ];

          lookForArgs.forEach(function (argName) {
            if (typeof column[argName] !== 'undefined') {
              args.push(column[argName]);
            }
          });

          const c = t[column.type](...args);

          // primary
          if (column.primary === true) {
            c.primary();
          } else if (_.isArray(column.primary)) {
            c.primary(column.primary);
          }

          // unique
          if (column.unique === true) {
            c.unique();
          }

          // nullable
          if (column.nullable === true) {
            c.nullable();
          } else if (column.nullable === false) {
            c.notNullable();
          }

          // default
          if (typeof column.default !== 'undefined') {
            c.defaultTo(column.default);
          }

          // unsigned
          if (column.unsigned === true) {
            c.unsigned();
          }

          // comment
          if (typeof column.comment !== 'undefined') {
            c.comment(column.comment);
          }
        });
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
