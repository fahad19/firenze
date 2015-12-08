# Create Behavior Class

```js
var f = require('firenze');

var TimestampBehavior = f.createBehavior({
  beforeSave: function (model) {
    model.set('created', new Date());
    return new f.Promise(true);
  }
});
```

If you are using ES6, the syntax can be much simpler:

```js
import {Behavior, Promise} from 'firenze';

class TimestampBehavior extends Behavior {
  beforeSave(model) {
    model.set('created', new Date());
    return new Promise(true);
  }
}
```
