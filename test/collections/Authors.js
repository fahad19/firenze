/* eslint-disable new-cap */

var lib = require('../../src/index');
var P = lib.Promise;
var TimestampBehavior = require('../behaviors/Timestamp');
var Author = require('../models/Author');

module.exports = function (db) {
  return db.createCollectionClass({
    table: 'authors',

    modelClass: Author,

    alias: 'Author',

    displayField: 'name',

    schema: {
      id: {
        type: 'increments'
      },
      name: {
        type: 'string'
      },
      bio: {
        type: 'text'
      }
    },

    behaviors: [
      {
        class: TimestampBehavior,
        options: {}
      }
    ],

    beforeDelete: function () {
      return new P.reject(true);
    },

    afterDelete: function (model) {
      return new P(function (resolve, reject) {
        model.set('title', 'Deleted');
        reject(true);
      });
    }
  });
};
