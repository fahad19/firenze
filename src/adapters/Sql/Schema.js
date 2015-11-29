import _ from 'lodash';
import P from 'bluebird';

import Schema from '../../Schema';

export default class SqlSchema extends Schema {
  dropTable(collection) {
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

  createTable(collection) {
    const connection = this.getConnection();
    const table = collection.table;

    return new P(function (resolve, reject) {
      connection.schema.createTable(table, function (t) {
        _.each(collection.schema, function (column, name) {
          t[column.type](name);
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
