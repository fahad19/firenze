/* eslint-disable new-cap */

var lib = require('../../src/index');
var P = lib.Promise;
var City = require('../models/City');

module.exports = function (db) {
  return db.createCollectionClass({
    table: 'cities',

    modelClass: City,

    alias: 'City',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
      },
      name: {
        type: 'string'
      },
      description: {
        type: 'text'
      },
      population: {
        type: 'integer'
      }
    }
  });
};
