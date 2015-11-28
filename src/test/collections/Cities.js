/* eslint-disable new-cap */

var P = require('../../Promise');
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
