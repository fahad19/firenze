# firenze.js

[![Build Status](https://img.shields.io/travis/fahad19/firenze/master.svg)](http://travis-ci.org/fahad19/firenze) [![npm](https://img.shields.io/npm/v/firenze.svg)](https://www.npmjs.com/package/firenze) [![Join the chat at https://gitter.im/fahad19/firenze](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-1dce73.svg)](https://gitter.im/fahad19/firenze)

Install it with [npm](https://npmjs.com):

```
$ npm install --save firenze
```

Or [Bower](http://bower.io):

```
$ bower install --save firenze
```

---

firenze.js is a adapter-based object relational mapper written in ES6 targetting node.js and the browser.

Visit [http://fahad19.github.io/firenze/](http://fahad19.github.io/firenze/) for documentation.

### Key features

* Adapter based structure to plug in any database/store
* Intuitive query builder
* Highly extensible with Behavior pattern
* Promise based workflow
* Strong validation support
* Small footprint of ~30kB minified file

The project is still under heavy development, and more features are expected to land in future releases.

### Available adapters

* [localStorage](https://github.com/fahad19/firenze-adapter-localstorage) (for browser only)
* [Memory](https://github.com/fahad19/firenze-adapter-memory) (works in both node and the browser)
* [MySQL](https://github.com/fahad19/firenze-adapter-mysql)
* [SQLite 3](https://github.com/fahad19/firenze-adapter-sqlite3)

Supports v0.2.x:

* [Redis](https://github.com/fahad19/firenze-adapter-redis)

### Available behaviors

* [Slug](https://github.com/fahad19/firenze-behavior-slug)
* [Timestamp](https://github.com/fahad19/firenze-behavior-timestamp)

## Testing

Tests are written with [mocha](http://visionmedia.github.com/mocha/), and can be run via npm:

```
$ npm test
```

## Releases

To publish a new release:

* Update `package.json` and `bower.json` with version number.
* Run:
  * `npm run test`
  * `npm run dist`
  * `npm run docs:publish`
* Commit the changes.
* Run `npm publish .`
* Tag the repository with `vX.X.X`

## Thanks

The project couldn't have happened if there weren't other projects to be inspired from. A big thanks goes to these open source projects that directly or indirectly helped make it possible:

* [knex.js](https://github.com/tgriesser/knex) and [bookshelf.js](https://github.com/tgriesser/bookshelf)
* [CakePHP](http://cakephp.org/)

## License

MIT © [Fahad Ibnay Heylaal](http://fahad19.com)
