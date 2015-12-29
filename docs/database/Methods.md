# Database Methods

### createCollection(extend)

Quickly create Collection class that references to current Database instance.

### getAdapter()

Returns adapter instance

### query()

Returns a new query builder of the Adapter

### schema()

Returns schema object for manipulating the Database

### transaction(fn)

Returns a Promise

Read more in [Transactions](../query/Transactions.html) page.

### getConnection()

Returns connection of the Adapter

### close()

Closes the connection

Returns a promise
