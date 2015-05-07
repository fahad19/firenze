var _ = require('lodash');
var Promise = require('bluebird');
var dotProp = require('dot-prop');

class Model {
  constructor(attributes = {}, extend = {}) {
    this.collectionClass = null;
    this.schema = {};
    this.attributes = attributes ? attributes : {};
    this.primaryKey = 'id';
    this.displayField = null;
    this.id = null;
    _.merge(this, extend);

    var id = this.get(this.primaryKey);
    if (id) {
      this.id = id;
    }
  }

  collection(options = {}) {
    if (!this.collectionClass) {
      return new Error('Cannot find any collectionClass');
    }

    var isInstance = function (i) {
      return !_.isFunction(i) && _.isString(i.table);
    };

    var C = this.collectionClass;

    C = new C(options);
    if (isInstance(C)) {
      return C;
    }

    C = new C(options);
    if (isInstance(C)) {
      return C;
    }

    return new C(options);
  }

  get(field) {
    var obj = this.toObject();
    return dotProp.get(obj, field);
  }

  set(field, value) {
    if (_.isObject(field)) {
      return _.merge(this.attributes, field);
    }

    this.attributes[field] = value;
  }

  toObject() {
    return this.attributes;
  }

  fetch(options = {}) {
    var id = this.getId();
    if (!id) {
      throw new Error('No ID found');
    }

    var collection = this.collection();
    _.merge(options, {
      conditions: {
        [this.alias + '.' + this.primaryKey]: id
      }
    });
    return new Promise(function (resolve, reject) {
      return collection.find('first', options).then(function (model) {
        resolve(model);
      }).catch(reject);
    });
  }

  getId() {
    var id = this.id || this.get(this.primaryKey);
    if (!_.isUndefined(id)) {
      return id;
    }

    return null;
  }

  isNew() {
    return this.getId() ? false : true;
  }

  save() {
    return this.collection().save(this);
  }
}

module.exports = Model;
