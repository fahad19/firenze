module.exports = function (db) {
  return db.Model({
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

    collectionClass: require('../collections/Authors')(db)
  });
};
