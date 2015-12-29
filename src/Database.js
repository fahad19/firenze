import _ from 'lodash';

import collectionFactory from './common/collectionFactory';

export default class Database {
  constructor(options = {}) {
    this.defaultOptions = {
      adapter: null,
      host: null,
      user: null,
      database: null,
      password: null,
      prefix: null
    };

    this.options = _.merge(this.defaultOptions, options);

    let AdapterClass = this.options.adapter;
    this.adapter = new AdapterClass(_.omit(this.options, 'adapter'));

    this.createCollection = collectionFactory(this);
  }

  getAdapter() {
    return this.adapter;
  }

  query() {
    return this.adapter.query();
  }

  schema() {
    return this.adapter.schema();
  }

  getConnection() {
    return this.getAdapter().getConnection();
  }

  transaction(func) {
    return this.getAdapter()
      .transaction(func);
  }

  close() {
    return this.getAdapter()
      .closeConnection();
  }
}
