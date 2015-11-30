/* eslint-disable new-cap */

import f from '../../src/index';

let Behavior = f.Behavior;
let P = f.Promise;

export default class Timestamp extends Behavior {
  // sync
  modelInitialize(model) {
    model.set('created', new Date());
  }

  // async
  beforeSave(model) {
    model.set('updated', new Date());
    return new P.resolve(true);
  }
}
