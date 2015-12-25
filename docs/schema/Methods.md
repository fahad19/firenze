# Methods

### getConnection()

Returns current Adapter's connection

### dropTableOfCollection(collection)

Drops the table for given collection.

Returns a promise.

### createTableFromCollection(collection)

Create table from given collection.

Schema can build the table from the information available in `collection.schema`.

### dropTable(tableName)

Drops/deletes the table.

Returns a promise.

### tableExists(tableName)

Returns a promise, resolving with a boolean value.

### renameTable(from, to)

Renames an existing table.

Returns a promise.

### createTable(tableName, collectionSchema)

Creates a table from a schema object in the format of `collection.schema`.

Example `collectionSchema`:

```js
{
  id: {
    type: 'integer',
    primary: true
  },
  title: {
    type: 'string',
    length: 100,
    nullable: true
  }
}
```

Read more in Types for column types.

Returns a promise.

### columnExists(tableName, columnName)

Returns a promise, resolving with a boolean value.

### dropColumn(tableName, columnName)

Drops the column from table.

Returns a promise.

### dropColumns(tableName, columnNames)

Drops the columns given as an array from table.

Returns a promise.

### createColumn(tableName, columnName, fieldSchema)

Creates a single column for an existing table.

Returns a promies.

### createColumns(tableName, collectionSchema)

Creates multiple columns for an existing table.

Returns a promise.

### renameColumn(tableName, from, to)

Renames a table column.

Returns a promise.

### createIndex(tableName, columns, indexName, indexType)

Creates a new index.

Returns a promise.

### dropIndex(tableName, columns, indexName)

Drops the index.

Returns a promise.
