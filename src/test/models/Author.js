/* eslint-disable new-cap */
var P = require('../../Promise');

var TimestampBehavior = require('../behaviors/Timestamp');

module.exports = function (db) {
  return db.createModelClass({
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

    collectionClass: function () {
      return require('../collections/Authors')(db);
    },

    beforeDelete: function () {
      return new P.reject(true);
    },

    afterDelete: function () {
      var self = this;
      return new P(function (resolve, reject) {
        self.set('title', 'Deleted');
        reject(true);
      });
    }
  });
};
