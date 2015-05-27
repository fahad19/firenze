var P = require('../../Promise');

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

    collectionClass: function () {
      return require('../collections/Authors')(db);
    },

    beforeDelete: function () {
      return new P.reject(true);
    },

    afterDelete: function () {
      var self = this;
      console.log('after delete');
      return new P(function (resolve, reject) {
        self.set('title', 'Deleted');
        reject(true);
      });
    }
  });
};
