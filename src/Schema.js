import P from 'bluebird';

export default class Schema {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getConnection() {
    return this.adapter.getConnection();
  }

  dropTable(collection) {
    return new P.resolve(true);
  }

  createTable(collection) {
    return new P.resolve(true);
  }

  // dropTableIfExists(tableName) { return new P.resolve(true); }

  // createTableIfNotExists(tableName, collectionSchema) { return new P.resolve(true); }

  // hasTable(tableName) { return new P.resolve(true); }

  // renameTable(from, to) { return new P.resolve(true); }

  // hasColumn(columnName) { return new P.resolve(true); }

  // dropColumn(columnName) { return new P.resolve(true); }

  // createColumn(tableName, columnName, collectionSchemaField) { return new P.resolve(true); }

  // renameColumn() { return new P.resolve(true); }

  // createIndex(tableName, columns, indexName, indexType) { return new P.resolve(true); }

  // dropIndex(tableName, columns, indexName) { return new P.resolve(true); }
}
