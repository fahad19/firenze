/* eslint-disable no-unused-vars */
import async from 'async';

import Promise from './Promise';

export default class Schema {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getConnection() {
    return this.adapter.getConnection();
  }

  dropTableOfCollection(collection) {
    const table = collection.table;

    return new Promise((resolve, reject) => {
      async.waterfall([
        // check if exists
        (callback) => {
          this.tableExists(table)
            .then(exists => callback(null, exists))
            .catch(error => callback(error));
        },

        // drop it if exists
        (exists, callback) => {
          if (!exists) {
            return callback(null, true);
          }

          this.dropTable(table)
            .then(result => callback(null, result))
            .catch(error => callback(error));
        }
      ], (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  createTableFromCollection(collection) {
    const table = collection.table;
    const collectionSchema = collection.schema;

    return this.createTable(table, collectionSchema);
  }

  dropTable(tableName) {
    return new Promise.resolve(true);
  }

  tableExists(tableName) {
    return new Promise.resolve(true);
  }

  renameTable(from, to) {
    return new Promise.resolve(true);
  }

  createTable(tableName, collectionSchema) {
    return new Promise.resolve(true);
  }

  columnExists(tableName, columnName) {
    return new Promise.resolve(true);
  }

  dropColumn(tableName, columnName) {
    return this.dropColumns(tableName, [columnName]);
  }

  dropColumns(tableName, columnNames) {
    return new Promise.resolve(true);
  }

  createColumn(tableName, columnName, fieldSchema) {
    return this.createColumns(tableName, {
      [columnName]: fieldSchema
    });
  }

  createColumns(tableName, collectionSchema) {
    return new Promise.resolve(true);
  }

  renameColumn(tableName, from, to) {
    return new Promise.resolve(true);
  }

  alterColumn(tableName, columnName, toName, fieldSchema) {
    return new Promise.resolve(true);
  }

  createIndex(tableName, columns, indexName, indexType) {
    return new Promise.resolve(true);
  }

  dropIndex(tableName, columns, indexName) {
    return new Promise.resolve(true);
  }
}
