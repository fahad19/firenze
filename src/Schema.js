import Promise from './Promise';

export default class Schema {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getConnection() {
    return this.adapter.getConnection();
  }

  dropTable(collection) { // eslint-disable-line
    return new Promise.resolve(true);
  }

  createTable(collection) { // eslint-disable-line
    return new Promise.resolve(true);
  }

  // dropTableIfExists(tableName) { return new Promise.resolve(true); }

  // createTableIfNotExists(tableName, collectionSchema) { return new Promise.resolve(true); }

  // hasTable(tableName) { return new Promise.resolve(true); }

  // renameTable(from, to) { return new Promise.resolve(true); }

  // hasColumn(columnName) { return new Promise.resolve(true); }

  // dropColumn(columnName) { return new Promise.resolve(true); }

  // createColumn(tableName, columnName, collectionSchemaField) { return new Promise.resolve(true); }

  // renameColumn() { return new Promise.resolve(true); }

  // createIndex(tableName, columns, indexName, indexType) { return new Promise.resolve(true); }

  // dropIndex(tableName, columns, indexName) { return new Promise.resolve(true); }
}
