import _ from 'lodash';
import P from './Promise';

export default class Behavior {
  constructor(extend = {}) {
    this.collection = null;
    this.options = {};

    _.merge(this, extend);
  }

  collectionInitialize(collection) { //eslint-disable-line

  }

  modelInitialize(model) { //eslint-disable-line

  }

  beforeSave(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

  afterSave(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

  beforeValidate(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

  afterValidate(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

  beforeDelete(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

  afterDelete(model) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }
}
