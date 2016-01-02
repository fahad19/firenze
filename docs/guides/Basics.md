# Basics

firenze.js is an ORM (object relational mapper). It tries to remain as database agnostic as possible, so that its adapter based architecture can wrap around any database environment, and provide a seamless experience to developers.

## Techonologies

Before getting started, it would help to have some basic knowledge of these things:

* [node.js](https://nodejs.org) and [npm](https://npmjs.com)
* [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) for asynchronous operations

## Terminologies

Some terminologies that we will use frequently:

* **Database**: Represents connection to a single database
* **Adapter**: What connects firenze.js to database environments with consistent API
* **Collection**: Represents a table in a Database
* **Model**: Represents a record/row in a Collection
* **Behavior**: Hooks into Collection and Model's lifecycle callbacks
