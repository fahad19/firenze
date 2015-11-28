import P from 'bluebird';

export default class Schema {
  constructor(adapter) {
    this.adapter = adapter;
  }

// ### dropTable(collection)
//
// Drop table if exists
//
  dropTable(collection) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }

// ### createTable(collection)
//
// Create table based on collection's schema
//
  createTable(collection) { //eslint-disable-line
    return new P(function (resolve) {
      return resolve();
    });
  }
}
