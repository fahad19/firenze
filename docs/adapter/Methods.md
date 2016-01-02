# Adapter Methods

Every adapter needs to implement at least these methods below:

### getConnection()

Returns the current connection

### closeConnection()

Closes the current connection.

Returns a promise.

### query()

Returns a new query object

### schema()

Returns Schema object

### transaction(fn)

Returns a Promise

Read more in [Transaction](../transaction) section.

### populateTable(collection, rows)

Inserts rows into collection's table

Returns a promise

### loadFixture(collection, rows)

Drops and creates table, and loads data for given collection

Returns a promise.

### loadAllFixtures(arr)

Runs fixtures for multiple collections

`arr` should be in the format of `[{collection: posts, rows: rows}]`

Returns a promise.
