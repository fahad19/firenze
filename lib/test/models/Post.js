'use strict';

module.exports = function (db) {
  return db.Model({
    schema: {
      id: {
        type: 'increments'
      },
      author_id: {
        type: 'integer'
      },
      title: {
        type: 'string'
      },
      body: {
        type: 'text'
      }
    },

    collectionClass: require('../collections/Posts')
  });
};