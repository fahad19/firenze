module.exports = function (db) {
  return db.Model({
    schema: {
      id: {
        type: 'integer' //'increments'
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

    collectionClass: require('../collections/Posts')(db)
  });
};
