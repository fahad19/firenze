# Create Association Class

(This page has incomplete documentation)

Adapters are able to create and roll their own Association class themselves.

You can do so like this:

```js
import { Association, Promise } from 'firenze';

export default class MyCustomAssociation extends Association {
  // types available in base class:
  //  - oneToOne(Collection) {}
  //  - oneToMany(Collection) {}
  //  - manyToOne(Collection) {}

  // define a new type
  someNewType(Collection) {
    return this.type('someNewType', Collection);
  }

  // method responsible for fetching related `include` data
  fetchInclude(model, include) {
    // `model` is the record that needs to include more associated data
    // `include` is the association key defined in model's Collection

    // model can be a User model's instance
    // include can be 'profile', the association key in Users collection

    const options = this.getParentAssociationOptions();

    // so fetch and set Profile for this model
    model.set('profile', fetchedProfileModel);

    // return a Promise with updated model
    return new Promise.resolve(model);
  }
}
```

More docs need to be written for this. Until then look at the example of SQL adapter in: https://github.com/fahad19/firenze/tree/master/src/adapters/Sql
