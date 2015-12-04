/* eslint-disable new-cap */
import {createBehavior, Promise} from '../../src';

export default createBehavior({
  // sync
  modelInitialize(model) {
    model.set('created', new Date());
  },

  // async
  beforeSave(model) {
    model.set('updated', new Date());
    return new Promise.resolve(true);
  }
})
