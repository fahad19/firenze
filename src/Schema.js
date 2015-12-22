/* eslint-disable no-unused-vars */
import Promise from './Promise';

export default class Schema {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getConnection() {
    return this.adapter.getConnection();
  }

  dropTableOfCollection(collection) {
    return new Promise.resolve(true);
  }

  createTableFromCollection(collection) {
    return new Promise.resolve(true);
  }

  dropTable(tableName) {
    return new Promise.resolve(true);
  }

  createTable(tableName, collectionSchema) {
    return new Promise.resolve(true);
  }

  tableExists(tableName) {
    return new Promise.resolve(true);
  }

  renameTable(from, to) {
    return new Promise.resolve(true);
  }

  columnExists(columnName) {
    return new Promise.resolve(true);
  }

  dropColumns(tableName, columnNames) {
    return new Promise.resolve(true);
  }

  createColumn(tableName, columnName, collectionSchemaField) {
    return new Promise.resolve(true);
  }

  renameColumn(tableName, from, to) {
    return new Promise.resolve(true);
  }

  createIndex(tableName, columns, indexName, indexType) {
    return new Promise.resolve(true);
  }

  dropIndex(tableName, columns, indexName) {
    return new Promise.resolve(true);
  }
}
