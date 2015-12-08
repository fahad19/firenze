# Changelog

* [`v0.3.0`](https://github.com/fahad19/firenze/compare/v0.2.1...v0.3.0)
  * New query builder
  * API for creating classes has been changed
    * `.createCollection()` instead of `.createCollectionClass()`
  * New docs
* v0.2.1
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
