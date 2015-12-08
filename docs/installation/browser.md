# Browser

You can download firenze.js using [Bower](http://bower.io).

```
$ bower install --save firenze
```

The package comes with multiple dist files, and you are free to choose whatever setup suits you best.

If you want to include just one file along with all the required dependencies:

```html
<script src="bower_components/firenze/dist/firenze.full.min.js"></script>

<script>
// the library is now available in `firenze` variable
</script>
```

If you wish to include only the core library, and load its dependencies manually:

```html
<script src="bower_components/lodash/lodash.min.js"></script>
<script src="bower_components/async/lib/async.js"></script>
<script src="bower_components/bluebird/js/browser/bluebird.min.js"></script>
<script src="bower_components/validator-js/validator.min.js"></script>

<script src="bower_components/firenze/dist/firenze.min.js"></script>

<script>
// use `firenze` variable to access the library
</script>
```
