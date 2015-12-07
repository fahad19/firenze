import Promise from './Promise';

// ## Schema
//
// Schema class is responsible for exposing methods for manipulating the database, like dropping and creating tables.
//
// It made its way into the project in v0.3, for abstracting the responsibilities of fixtures in tests mainly.
//
// The class is intended to be primarily used by Adapters internally only.
//
// ### Creating classes
//
// Unless you are building an adapter yourself, you wouldn't be required to create a Schema class.
//
// Example in ES6:
//
// ```js
// import {Schema} from 'firenze';
//
// export default MyCustomSchema extends Schema {
//   // ...
// }
// ```
//
export default class Schema {
  constructor(adapter) {

// ### Properties
//
// #### adapter
//
// Current instance of Adapter
//
    this.adapter = adapter;
  }

// ### Methods
//
// #### getConnection()
//
// Returns current Adapter's connection
//
  getConnection() {
    return this.adapter.getConnection();
  }

// #### dropTable(collection)
//
// Drops the table for given collection.
//
// Returns a promise.
//
  dropTable(collection) { // eslint-disable-line
    return new Promise.resolve(true);
  }

// #### createTable(collection)
//
// Create table from given collection.
//
// Schema can build the table from the information available in `collection.schema`.
//
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
