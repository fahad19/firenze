# Create Query Class

Unless you are building an Adapter yourself, you wouldn't be required to create Query classes yourself.

Example in ES6:

```js
// base Query class
import {Query} from 'firenze';

// custom helper classes needed for creating new Query class
import FooExpression from './Expression';
import FooFunctions from './Functions';

export default class FooQuery extends Query {
  constructor(options = {}) {
    options = {
      expressionClass: FooExpression,
      functionsClass: FooFunctions,
      ...options
    };

    super(options);
  }
}
```
