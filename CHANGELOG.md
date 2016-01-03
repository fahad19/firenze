# Changelog

* [`v0.6.0`](https://github.com/fahad19/firenze/compare/v0.5.0...v0.6.0)
  * Reject promise when validation fails
  * Fix for async validation rules
* [`v0.5.0`](https://github.com/fahad19/firenze/compare/v0.4.0...v0.5.0)
  * New Transactions API
* [`v0.4.0`](https://github.com/fahad19/firenze/compare/v0.3.1...v0.4.0)
  * New Migrations API
  * Core adapters extended further
  * Better JOINs support (with nesting) in API
  * CLI support
  * Bug fixes and consistency in tests
* [`v0.3.0`](https://github.com/fahad19/firenze/compare/v0.2.1...v0.3.0)
  * New query builder
  * Further abstraction of queries with Expressions and Functions
  * API for creating classes has been changed
    * `.createCollection()` instead of `.createCollectionClass()`
    * `.createModel()` instead of `.createModelClass()`
    * `.createBehavior()` instead of `.createBehaviorClass()`
  * New documentation website
* [v0.2.1](https://github.com/fahad19/firenze/compare/v0.2.0...v0.2.1)
  * Fix for updating records
* [`v0.2.0`](https://github.com/fahad19/firenze/compare/v0.1.5...v0.2.0):
  * Model classes are now optional, as configuration has moved to Collection level.
  * Model classes cannot be created via Database instance any more
  * Behavior method signatures have changed (accepts context as first argument now).
  * Behavior `initialize` method has been renamed as `modelInitialize`.
  * Adapter's `closeConnection` method returns a Promise now.
  * Fixture loader , e.g. `Adapter.loadFixture()`, now accepts collection as argument instead of Model.
* [`v0.1.5`](https://github.com/fahad19/firenze/compare/v0.1.4...v0.1.5):
  * Added support for behaviors.
  * Added `model.initialize()` as a lifecycle callback.
  * Fix in MemoryAdapter for running tests.
