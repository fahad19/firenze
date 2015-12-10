/* eslint-disable new-cap */
import _ from 'lodash';

import lib from '../../';

import Query from './Query';
import Schema from './Schema';

const {Adapter} = lib;

export default class MemoryAdapter extends Adapter {
  constructor(givenOptions = {}) {
    const options = {
      queryClass: Query,
      schemaClass: Schema,
      ...givenOptions
    };

    super(options);

    this.options = options;
    this.data = {};
  }

  getData(path = null) {
    if (!path) {
      return this.data;
    }

    return _.get(this.data, path);
  }

  setData(path = null, value = null) {
    return _.set(this.data, path, value);
  }

  getConnection() {
    return this.data;
  }
}
