# Contributing

* For each individual bug/fix/feature, please create a separate Issue/Pull Request.
* Make sure tests and documentation are written, and has good coverage.
* Do not update the `dist` files.
* Be nice.

## Releases

To publish a new release, run:

```
$ git checkout master

$ npm run release:pre
$ npm run version:patch|minor|major
$ npm run release:post
```

If a patch release, just run `npm run release`.
