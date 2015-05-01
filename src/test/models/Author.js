module.exports = function (db) {
  return db.Model({
    alias: 'Author',

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
      require('../collections/Authors')(db)
    }
  });
};
