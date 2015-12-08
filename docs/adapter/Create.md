# Create Adapter Class

If you want to use firenze.js with a database platform that is not yet supported by existing adapters, you might want to create your own.

Examples below use ES6:

```js
import {Adapter} from 'firenze';

// your own implementations of Query and Schema
import CustomQuery from './Query';
import CustomSchema from './Schema'

export default class CustomAdapter extends Adapter {
  constructor(options = {}) {
    options = {
      schemaClass: CustomSchema,
      queryClass: CustomQuery,
      ...options
    };

    super(options);
  }
}
```

Read more about Schema and Query in further chapters.
