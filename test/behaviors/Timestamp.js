/* eslint-disable new-cap */
import lib from '../../';

const {createBehavior, Promise} = lib;

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
});
