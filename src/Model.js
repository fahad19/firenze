/* eslint-disable new-cap */

import _ from 'lodash';
import P from './Promise';

export default class Model {
  constructor(attributes = {}, extend = {}) {
    this.attributes = attributes ? attributes : {};
    this.id = null;

    _.merge(this, extend);

    let id = this.get(this.collection.primaryKey);
    if (id) {
      this.id = id;
    }

    this.collection.callBehavedMethod(this, 'modelInitialize');
  }

  get(field) {
    let obj = this.toObject();
    return _.get(obj, field);
  }

  set(field, value) {
    if (_.isObject(field)) {
      return _.merge(this.attributes, field);
    }

    return _.set(this.attributes, field, value);
  }

  toObject() {
    return this.attributes;
  }

  toJSON() {
    return this.toObject();
  }

  fetch() {
    let id = this.getId();
    if (!id) {
      throw new Error('No ID found');
    }

    return new P((resolve, reject) => {
      return this.collection.findById(id)
        .then(function (model) {
          resolve(model);
        }).catch(reject);
    });
  }

  getId() {
    let id = this.id || this.get(this.collection.primaryKey);
    if (!_.isUndefined(id)) {
      return id;
    }

    return null;
  }

  isNew() {
    return this.getId() ? false : true; // eslint-disable-line
  }

  resetTransact() {
    this._transact = null;

    return this;
  }

  transact(t) {
    this._transact = t;

    return this;
  }

  save(givenOptions = {}) {
    const options = {
      transact: this._transact ? this._transact : null,
      ...givenOptions
    };

    return this
      .resetTransact()
      .collection.save(this, options);
  }

  saveField(field, value) {
    this.set(field, value);

    return this.save({
      fields: [field]
    });
  }

  clear() {
    this.id = null;
    this.attributes = {};
  }

  delete(options = {}) {
    return this.collection.delete(this, options);
  }

  validate(options = {}) {
    return this.collection.validate(this, options);
  }

  validateField(field, value = null) {
    return this.collection.validateField(this, field, value);
  }
}
